import { AppText } from "@/components/AppText";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

type StartButtonProps = {
  isRunning: boolean;
  onPress: () => void;
  disabled?: boolean;
};

export function StartButton({ isRunning, onPress, disabled }: StartButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        isRunning ? styles.stop : styles.start,
        disabled ? styles.disabled : null,
      ]}
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled}
    >
      <AppText size={18} weight="bold" color="#0F172A">
        {isRunning ? "STOP" : "START"}
      </AppText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    marginTop: 18,
    width: "100%",
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  start: {
    backgroundColor: "#FACC15",
  },
  stop: {
    backgroundColor: "#F59E0B",
  },
  disabled: {
    opacity: 0.5,
  },
});
