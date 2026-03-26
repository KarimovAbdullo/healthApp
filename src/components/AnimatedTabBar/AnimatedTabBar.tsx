import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

import {
  IconSymbol,
  type IconSymbolName,
} from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { useEffect } from "react";

function routeToIcon(routeName: string): IconSymbolName {
  switch (routeName) {
    case "index":
      return "house.fill";
    case "results":
      return "chart.bar.fill";
    case "traning":
      return "fitness.center.fill";
    case "profile":
      return "person.fill";
    default:
      return "house.fill";
  }
}

function AnimatedTabButton({
  routeName,
  isFocused,
  onPress,
  colors,
}: {
  routeName: string;
  isFocused: boolean;
  onPress: () => void;
  colors: { tabIconDefault: string };
}) {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    if (isFocused) {
      // 🔥 1 MARTA 360° aylanish
      rotate.value = 0;
      rotate.value = withTiming(360, { duration: 500 });
    }
  }, [isFocused]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }, { rotate: `${rotate.value}deg` }],
    };
  });

  const color = isFocused ? "#4FD1FF" : colors.tabIconDefault;

  const iconName = routeToIcon(routeName);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.9);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={styles.tab}
    >
      <Animated.View style={animatedStyle}>
        <IconSymbol name={iconName} size={30} color={color} />
      </Animated.View>
    </Pressable>
  );
}

export function AnimatedTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const colors = Colors[colorScheme ?? "light"];

  return (
    <View style={styles.container}>
      <View style={styles.blurWrapper}>
        <BlurView intensity={80} tint="dark" style={styles.blur}>
          <View style={styles.tabsWrapper}>
            {state.routes.map((route, index) => {
              const isFocused = state.index === index;

              const onPress = () => {
                if (process.env.EXPO_OS === "ios") {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }

                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                }
              };

              return (
                <AnimatedTabButton
                  key={route.key}
                  routeName={route.name}
                  isFocused={isFocused}
                  onPress={onPress}
                  colors={colors}
                />
              );
            })}
          </View>
        </BlurView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 40,
  },
  blurWrapper: {
    flexDirection: "row",
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(148,163,253,0.4)",
  },
  blur: {
    flex: 1,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor:
      Platform.OS === "ios"
        ? "rgba(89, 137, 240, 0.05)"
        : "rgba(57, 57, 57, 0.77)",
  },
  tabsWrapper: {
    flexDirection: "row",
    paddingVertical: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
