import {
  View,
  Text,
  Button,
  ScrollView,
  Pressable,
  StyleSheet,
} from "react-native";
import * as React from "react"; // Import React for useState hook
import { useState } from "react"; // Import useState hook

export default function Secondpage() {
  const [showOptions, setShowOptions] = useState(false); // State to control option visibility
  const [selectedOption, setSelectedOption] = useState(null); // State to store selected option
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");

  const handleSummarize = async () => {
    try {
      const response = await fetch("YOUR_BACKEND_URL/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: inputText,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to summarize text");
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };
  return (
    <View style={{ flex: 1, backgroundColor: "#bff5f5", padding: 70 }}>
      <ScrollView>
        <Button
          style={{ innerHeight: 130 }}
          title="Upload"
          onPress={handleUploadPress}
        />
      </ScrollView>
      {showOptions && ( // Conditionally render options only when visible
        <View style={styles.options}>
          <Pressable
            style={styles.option}
            onPress={() => handleOptionPress("image")}
          >
            <Text>Image</Text>
          </Pressable>
          <Pressable
            style={styles.option}
            onPress={() => handleOptionPress("pdf")}
          >
            <Text>PDF</Text>
          </Pressable>
          <Pressable
            style={styles.option}
            onPress={() => handleOptionPress("text")}
          >
            <Text>Text</Text>
          </Pressable>
        </View>
      )}
      <View style={styles.but}>
        <Button title="PROCESS" onPress={handleProcessPress} color="#080625" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  but: { marginBottom: 20 },
  options: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  option: {
    padding: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
  },
});
