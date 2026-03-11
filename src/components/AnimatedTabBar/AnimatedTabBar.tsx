import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import { Dimensions, Pressable, StyleSheet, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
} from "react-native-reanimated";

import { IconSymbol } from "@/components/ui/icon-symbol";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

const { width } = Dimensions.get("window");
const TAB_COUNT = 2;
const TAB_WIDTH = width / TAB_COUNT;
const INDICATOR_WIDTH = 56;

function AnimatedTabButton({
  route,
  index,
  isFocused,
  options,
  onPress,
  colors,
}: {
  route: { key: string; name: string };
  index: number;
  isFocused: boolean;
  options: any;
  onPress: () => void;
  colors: { tabIconSelected: string; tabIconDefault: string };
}) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const color = isFocused ? colors.tabIconSelected : colors.tabIconDefault;
  const iconName = index === 0 ? "house.fill" : "person.fill";
  const title = index === 0 ? "Home" : "Profile";

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.88, { damping: 15, stiffness: 300 });
      }}
      onPressOut={() => {
        scale.value = withSpring(1, { damping: 15, stiffness: 300 });
      }}
      style={styles.tab}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      accessibilityLabel={options.tabBarAccessibilityLabel}
      testID={options.tabBarTestID}
    >
      <Animated.View style={[styles.tabContent, animatedStyle]}>
        <IconSymbol name={iconName} size={24} color={color} />
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

  const glow = useSharedValue(0.4);

  const blurAnimatedStyle = useAnimatedStyle(() => ({
    shadowRadius: 20 + glow.value * 10,
    borderColor: `rgba(148, 163, 253, ${0.6 + glow.value * 0.4})`,
    shadowColor: "rgba(94, 234, 212, 1)",
  }));

  glow.value = withRepeat(
    withSpring(1, { damping: 15, stiffness: 80 }),
    -1,
    true,
  );

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.blurWrapper, blurAnimatedStyle]}>
        <BlurView intensity={80} tint="dark" style={styles.blur}>
          <View style={styles.tabsWrapper}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
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
                  route={route}
                  index={index}
                  isFocused={isFocused}
                  options={options}
                  onPress={onPress}
                  colors={colors}
                />
              );
            })}
          </View>
        </BlurView>
      </Animated.View>
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
    borderColor: "rgba(148,163,253,0.8)",
    shadowColor: "rgba(94,234,212,1)",
    shadowOpacity: 0.9,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 2 },
    elevation: 7,
  },
  blur: {
    flex: 1,
    borderRadius: 28,
    overflow: "hidden",
    backgroundColor: "rgba(89, 137, 240, 0.71)",
  },
  tabsWrapper: {
    flex: 1,
    flexDirection: "row",
  },
  indicator: {
    position: "absolute",
    width: INDICATOR_WIDTH,
    height: 40,
    borderRadius: 20,
    top: 0,
    left: 0,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "500",
    // marginTop: 4,
  },
});
