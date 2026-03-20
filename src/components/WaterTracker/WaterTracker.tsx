import { AppText } from "@/components/AppText";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import { Animated, Easing, Image, ImageSourcePropType, StyleSheet, View } from "react-native";
import LogWaterButton from "../LogWaterButton/LogWaterButton";

type Props = {
  currentLiters: number;
  goalLiters: number;
  onLogPress?: () => void;
};

const bottleImg: ImageSourcePropType = require("@/assets/images/botll.png");
const doneImg: ImageSourcePropType = require("@/assets/images/done5.png");

export const WaterTracker = ({
  currentLiters,
  goalLiters,
  onLogPress,
}: Props) => {
  const safeGoal = goalLiters > 0 ? goalLiters : 1;
  const filledProgress = Math.min(1, currentLiters / safeGoal);
  const isDone = currentLiters >= goalLiters && goalLiters > 0;
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.45,
          duration: 900,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
      ]),
    );

    loop.start();
    return () => {
      loop.stop();
    };
  }, [glowAnim]);

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={["#1E1B4B", "#312E81"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.leftSection}>
          <Image
            source={bottleImg}
            style={styles.bottle}
            resizeMode="contain"
          />
        </View>

        <View style={styles.centerSection}>
          <AppText size={14} weight="semibold" color="#F9FAFB">
            Water Tracker
          </AppText>

          {isDone ? (
            <View style={styles.doneRow}>
              <AppText size={13} weight="semibold" color="#22C55E">
                Done
              </AppText>
              <Image
                source={doneImg}
                style={styles.doneIcon}
                resizeMode="contain"
              />
            </View>
          ) : (
            <AppText size={13} color="#E5E7EB" style={{ marginTop: 2 }}>
              {currentLiters.toFixed(1)} / {goalLiters.toFixed(1)} L drank
            </AppText>
          )}

          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressFillWrap,
                {
                  width: `${filledProgress * 100}%`,
                  shadowOpacity: glowAnim,
                },
              ]}
            >
              <LinearGradient
                colors={["#5FA8FF", "#3B82F6", "#2563EB"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.progressFill}
              />
            </Animated.View>
          </View>
        </View>

        <View style={styles.rightSection}>
          <LogWaterButton onPress={onLogPress} />
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 22,
    overflow: "hidden",
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  leftSection: {
    paddingRight: 10,
  },
  bottle: {
    width: 50,
    height: 90,
  },
  centerSection: {
    flex: 1,
  },
  doneRow: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  doneIcon: {
    width: 16,
    height: 16,
  },
  rightSection: {
    paddingLeft: 10,
    justifyContent: "center",
  },
  progressTrack: {
    marginTop: 6,
    height: 8,
    borderRadius: 999,
    backgroundColor: "rgba(148,163,184,0.6)",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 999,
  },
  progressFillWrap: {
    height: "100%",
    borderRadius: 999,
    overflow: "hidden",
    shadowColor: "#5FA8FF",
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 7,
  },
  glassesRow: {
    flexDirection: "row",
    marginTop: 6,
    gap: 4,
  },
  glass: {
    width: 16,
    height: 22,
  },
  logButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "#A855F7",
  },
});

export default WaterTracker;
