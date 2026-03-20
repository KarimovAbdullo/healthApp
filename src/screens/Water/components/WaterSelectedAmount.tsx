import { AppText } from "@/components/AppText";
import React from "react";
import { Animated, View } from "react-native";

import { styles } from "../WaterScreen.styles";

export function WaterSelectedAmount({
  scaleAnim,
  totalSelected,
}: {
  scaleAnim: Animated.Value;
  totalSelected: number;
}) {
  return (
    <Animated.View
      style={{
        marginTop: 24,
        alignItems: "center",
        transform: [{ scale: scaleAnim }],
      }}
    >
      <AppText size={54} weight="bold" color="#22C55E">
        +{totalSelected.toFixed(1)} L
      </AppText>
    </Animated.View>
  );
}

// Keep View import to avoid TS complaints if styles expand.
void View;
void styles;

