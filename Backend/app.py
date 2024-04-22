from flask import Flask, request, render_template as rt
from flask_cors import CORS  # Import CORS from flask_cors
import PyPDF2
from docx import Document
from transformers import T5ForConditionalGeneration, AutoTokenizer
from PIL import Image
import pytesseract
import torch
import tensorflow as tf
import re
from random import randint
import os
from tempfile import mkdtemp
import shutil

app = Flask(__name__, template_folder='template')
CORS(app, resources={r"/*": {"origins": ["http://localhost:5500", "http://127.0.0.1:5500/template/"]}})

model_name = "google-t5/t5-base"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = T5ForConditionalGeneration.from_pretrained(model_name)


@app.route('/', methods=['POST'])
def summarize():
    try:
        if 'text' in request.form:
            text = request.form['text']
            summary = summarize_with_llm(text)
            return summary
    except Exception as e:
        # print(f"Error extracting text from PDF: {e}")
        text = f"Error reading text with exception {e}. Please reload the app"
        return text
    try:
        if 'file' in request.files:
            file = request.files['file']
            filename = file.filename
            temp_dir = mkdtemp()
            uploaded_file_path = os.path.join(temp_dir, filename)
            file.save(uploaded_file_path)
            # print(filename)
            if filename.lower().endswith('.pdf'):
                try:
                    text = ''
                    with open(uploaded_file_path, 'rb') as f:
                        reader = PyPDF2.PdfReader(f)
                        for page_num in range(len(reader.pages)):
                            page = reader.pages[page_num]
                            text += page.extract_text()
                    # print(text)

                    shutil.rmtree(temp_dir)
                    summary = summarize_with_llm(text)
                    return summary
                except Exception as e:
                    # print(f"Error extracting text from PDF: {e}")
                    text = f"Error extracting text from PDF with exception {e}. Please reload the app"
                    return text

            elif filename.lower().endswith('.docx'):
                try:
                    doc = Document(uploaded_file_path)
                    text = ''
                    for paragraph in doc.paragraphs:
                        text += paragraph.text + '\n'

                    shutil.rmtree(temp_dir)
                    summary = summarize_with_llm(text)
                    return summary
                except Exception as e:
                    text = f"Error reading text file with exception {e}. Please reload the app"
                    return text

            elif filename.lower().endswith('.txt'):
                try:
                    with open(uploaded_file_path, 'r', encoding='utf-8') as f:
                        text = f.read()
                    shutil.rmtree(temp_dir)
                    summary = summarize_with_llm(text)
                    return summary
                except Exception as e:
                    print(f"Error reading text file: {e}")
                    text = "Error reading text file. Please reload the app"
                    return text

            elif filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                try:
                    pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'
                    with Image.open(file) as img:
                        text = pytesseract.image_to_string(img)
                        summary = summarize_with_llm(text)
                        return summary
                except Exception as e:
                    text = f"Error extracting text from image: {e}"
                    return text

            else:
                text = f"Got unexpected file extension:- {filename}. Please provide file of .pdf, .txt, .docx, .png, .jpg and .jpeg .\nWe are working on our app so in next updates more extensions will be added."
                return text
        else:
            print(f"Received:- {request.files}")
    except Exception as e:
        text = f"Error extracting text: {e}"
        return 


def summarize_with_llm(text):
    chunk_size = randint(1200, 1600)
    text_chunks = chunk_text(text, chunk_size)
    summaries = []
    for chunk in text_chunks:
        preprocessed_chunk = preprocess_text(chunk)
        input_ids = tokenizer(f"summarize: {preprocessed_chunk}", max_length=1024,truncation=True, return_tensors="pt")["input_ids"]
        output = model.generate(
            input_ids,
            min_length=10,
            max_length=256,
            num_beams=7,
            temperature=1.1,
            do_sample=True,
            early_stopping=True,
            length_penalty=0.9,
            top_k=47,
            top_p=0.9
        )
        summary = tokenizer.decode(output[0], skip_special_tokens=True)
        summaries.append(summary)
    return ' '.join(summaries)


def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'[^\w\s.,\']', '', text)
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def chunk_text(text, chunk_size=1400):
    chunks = []
    start = 0
    while start < len(text):
        chunks.append(text[start:start+chunk_size])
        start += chunk_size
    return chunks


if __name__ == '__main__':
    app.run(debug=True, port=8000)