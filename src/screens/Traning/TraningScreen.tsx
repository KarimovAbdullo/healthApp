import { ImageBackground, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const TraningScreen = () => {
  return (
    <ImageBackground
      source={require("@/assets/images/bb.png")}
      style={{ flex: 1 }}
    >
      <SafeAreaView>
        <View>
          <Text>TraningScreen</Text>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

export default TraningScreen;
