import { useEffect } from "react";
import { Text, TextProps } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
} from "react-native-reanimated";

const AnimatedText = Animated.createAnimatedComponent(Text);

type NeonGoldTextProps = TextProps & {
  children: string;
};

export function NeonGoldText({ children, style, ...rest }: NeonGoldTextProps) {
  const glow = useSharedValue(0);

  useEffect(() => {
    glow.value = withRepeat(
      withSpring(1, { damping: 15, stiffness: 80 }),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      glow.value,
      [0, 0.5, 1],
      ["#FFD700", "#FFA500", "#FFF8DC"]
    ),
  }));

  return (
    <AnimatedText
      style={[
        style,
        {
          textShadowColor: "rgba(255, 215, 0, 0.8)",
          textShadowOffset: { width: 0, height: 0 },
          textShadowRadius: 6,
        },
        animatedStyle,
      ]}
      {...rest}
    >
      {children}
    </AnimatedText>
  );
}
