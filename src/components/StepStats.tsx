import { AppText } from "@/components/AppText";
import React from "react";
import { StyleSheet, View } from "react-native";

type StepStatsProps = {
  distanceMeters: number;
  goalMeters: number;
  steps: number;
};

export function StepStats({ distanceMeters, goalMeters, steps }: StepStatsProps) {
  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <AppText size={15} color="#E5E7EB">
          Current
        </AppText>
        <AppText size={20} weight="bold" color="#FACC15">
          {Math.round(distanceMeters)} m
        </AppText>
      </View>

      <View style={styles.row}>
        <AppText size={15} color="#E5E7EB">
          Goal
        </AppText>
        <AppText size={18} weight="semibold" color="#F9FAFB">
          {goalMeters} m
        </AppText>
      </View>

      <View style={styles.row}>
        <AppText size={15} color="#E5E7EB">
          Steps
        </AppText>
        <AppText size={18} weight="semibold" color="#F9FAFB">
          {steps.toLocaleString()}
        </AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(250,204,21,0.25)",
    backgroundColor: "rgba(15,23,42,0.65)",
    gap: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
