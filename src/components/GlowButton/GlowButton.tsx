import { BlurView } from "expo-blur";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

type GlassTabBarProps = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export default function GlassTabBar({ children, style }: GlassTabBarProps) {
  return (
    <View>
      <BlurView intensity={1} tint="prominent" style={[styles.blur, style]}>
        {children}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  blur: {
    flexDirection: "row",
    // paddingVertical: 14,
    // borderRadius: 100,
    paddingHorizontal: 8,

    // overflow: "hidden",

    backgroundColor: "rgba(255, 255, 255, 0.35)",

    // borderLeftWidth: 1,
    // borderColor: "rgba(255,255,255,0.08)",

    shadowColor: "white",
    shadowOpacity: 0.9,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },

    // elevation: 22,
  },
});
