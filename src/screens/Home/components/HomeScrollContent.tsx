import FoodTracker from "@/components/FoodTracker/FoodTracker";
import { WaterTracker } from "@/components/WaterTracker/WaterTracker";
import React from "react";
import { ScrollView } from "react-native";

import type { UserMetrics } from "../HomeScreen";
import Header from "./Header";

export function HomeScrollContent({
  scrollRef,
  metrics,
  onEditPress,
  waterLiters,
  waterGoal,
  onFoodPress,
  onWaterPress,
}: {
  scrollRef: React.RefObject<ScrollView | null>;
  metrics: UserMetrics | null;
  onEditPress: () => void;
  waterLiters: number;
  waterGoal: number;
  onFoodPress: () => void;
  onWaterPress: () => void;
}) {
  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <Header metrics={metrics} onEditPress={onEditPress} />
      <FoodTracker
        breakfast={0}
        current={900}
        totalCalories={1800}
        onLogPress={onFoodPress}
      />
      <WaterTracker
        currentLiters={waterLiters}
        goalLiters={waterGoal}
        onLogPress={onWaterPress}
      />
    </ScrollView>
  );
}

