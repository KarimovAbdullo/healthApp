import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, ViewStyle } from "react-native";

type Props = {
  onPress?: () => void;
  style?: ViewStyle;
  text?: string;
};

const LogWaterButton: React.FC<Props> = ({
  onPress,
  style,
  text = "Log Water",
}) => {
  return (
    <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={style}>
      <LinearGradient
        colors={["#8E7CFF", "#6C4DFF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        <Text style={styles.text}>{text}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default LogWaterButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 20,
    // shadowColor: "rgba(106, 82, 213, 0.2)",
    // shadowOffset: { width: 0, height: 4 },
    // shadowOpacity: 0.25,
    // shadowRadius: 6,
    // elevation: 5,
    // alignItems: "center",
    // justifyContent: "center",

    // border (rasmdagidek light stroke)
    borderWidth: 1,
    borderColor: "rgba(106, 82, 213, 0.2)",

    // shadow (iOS)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,

    // elevation (Android)
    elevation: 5,

    alignItems: "center",
    justifyContent: "center",
  },

  text: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
