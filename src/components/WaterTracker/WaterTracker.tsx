import { AppText } from "@/components/AppText";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Image, ImageSourcePropType, StyleSheet, View } from "react-native";
import LogWaterButton from "../LogWaterButton/LogWaterButton";

type Props = {
  currentLiters: number;
  goalLiters: number;
  onLogPress?: () => void;
};

const bottleImg: ImageSourcePropType = require("@/assets/images/botll.png");
const glassImg: ImageSourcePropType = require("@/assets/images/stakan.png");

export const WaterTracker = ({
  currentLiters,
  goalLiters,
  onLogPress,
}: Props) => {
  const safeGoal = goalLiters > 0 ? goalLiters : 1;
  const filledProgress = Math.min(1, currentLiters / safeGoal);

  // 1 glass ~ 0.25L (4 glasses ≈ 1L)
  const totalGlasses = Math.round(goalLiters / 0.25);
  const filledGlasses = Math.round(currentLiters / 0.25);

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

          <AppText size={13} color="#E5E7EB" style={{ marginTop: 2 }}>
            {currentLiters.toFixed(1)} / {goalLiters.toFixed(1)} L drank
          </AppText>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${filledProgress * 100}%` },
              ]}
            />
          </View>

          <View style={styles.glassesRow}>
            {Array.from({ length: totalGlasses }).map((_, index) => {
              const isFilled = index < filledGlasses;
              return (
                <Image
                  key={index}
                  source={glassImg}
                  style={[styles.glass, { opacity: isFilled ? 1 : 0.3 }]}
                  resizeMode="contain"
                />
              );
            })}
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
    backgroundColor: "#22C55E",
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
