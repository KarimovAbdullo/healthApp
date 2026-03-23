import { GenerateMealCard } from "@/components/GenerateMealCard/GenerateMealCard";
import FoodTracker from "@/components/FoodTracker/FoodTracker";
import StepTracker from "@/components/StepTracker/StepTracker";
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
  foodCurrentKcal,
  foodGoalKcal,
  onFoodPress,
  onWaterPress,
  onStepPress,
  onGenerateMealPress,
  stepCurrentSteps,
  stepGoalSteps,
}: {
  scrollRef: React.RefObject<ScrollView | null>;
  metrics: UserMetrics | null;
  onEditPress: () => void;
  waterLiters: number;
  waterGoal: number;
  foodCurrentKcal: number;
  foodGoalKcal: number;
  onFoodPress: () => void;
  onWaterPress: () => void;
  onStepPress: () => void;
  onGenerateMealPress: () => void;
  stepCurrentSteps: number;
  stepGoalSteps: number;
}) {
  return (
    <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
      <Header metrics={metrics} onEditPress={onEditPress} />
      <FoodTracker
        breakfast={0}
        current={foodCurrentKcal}
        totalCalories={foodGoalKcal}
        onLogPress={onFoodPress}
      />
      <WaterTracker
        currentLiters={waterLiters}
        goalLiters={waterGoal}
        onLogPress={onWaterPress}
      />
      <StepTracker
        currentSteps={stepCurrentSteps}
        goalSteps={stepGoalSteps}
        onPress={onStepPress}
      />
      <GenerateMealCard onPress={onGenerateMealPress} />
    </ScrollView>
  );
}

