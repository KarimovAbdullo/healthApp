import { ReactNode, useEffect } from "react";
import { Platform, StyleSheet, View, ViewStyle } from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
} from "react-native-reanimated";

type NeonGlassCardProps = {
  children: ReactNode;
  style?: ViewStyle;
};

export function NeonGlassCard({ children, style }: NeonGlassCardProps) {
  const glow = useSharedValue(0.3);

  useEffect(() => {
    glow.value = withRepeat(
      withSpring(1, { damping: 12, stiffness: 100 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(
      glow.value,
      [0.3, 1],
      ["rgba(120, 220, 255, 0.95)", "rgba(150, 240, 255, 1)"]
    ),
    shadowColor: "rgba(150, 240, 255, 1)",
    shadowOpacity: 1,
    shadowRadius: interpolate(glow.value, [0.3, 1], [20, 34]),
    shadowOffset: { width: 0, height: 0 },
  }));

  return (
    <Animated.View style={[styles.wrapper, animatedStyle]}>
      <View style={[styles.inner, style]}>{children}</View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 20,
    borderWidth: 1.5,
    overflow: "hidden",
    ...(Platform.OS === "android" && { elevation: 12 }),
  },
  inner: {
    flexDirection: "row",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
    minHeight: 36,
    alignItems: "center",
    justifyContent: "center",
  },
});
