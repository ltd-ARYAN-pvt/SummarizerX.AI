import { NavigationHelpersContext } from "@react-navigation/native";
import { View, Text, Image, StyleSheet ,Button,StatusBar,Pressable} from "react-native";
const Imagelogo = require("../assets/i2.jpg");
import { useNavigation } from "@react-navigation/native";

export default function Fpage() {
  const navigation=useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.content}>
      <StatusBar backgroundColor="black"/>
      <Image
        source={Imagelogo}
        style={{ width: 300, height: 150, borderRadius: 10 }}
      />
      <Text style={styles.text1}>Hii!</Text>
      <Text style={styles.text2}>Welcome</Text>
      <Text style={styles.text3}>This app helps you summarize a long article into short!</Text>
      </View>
      <View style={styles.but}>

      <Button
          title="NEXT ->"
          onPress={()=>navigation.navigate("previous")}
          color="#080625"
          paddingTop="40"
          >
          </Button>
            </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#bff5f5", padding: 20 },
  content: { flex: 1 },
  text2: { paddingTop: 10, fontSize: 40, fontWeight: "bold" },
  text1: { paddingTop: 20, fontSize: 40, fontWeight: "bold" },
  text3: { paddingTop: 20, fontSize: 18, fontWeight: "200" },
  but: {marginBottom:20

  }
});
