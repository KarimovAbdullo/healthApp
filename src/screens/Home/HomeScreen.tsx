import {
  getBodyCategory,
  getBMR,
  getDailyStepGoalSteps,
  getTDEE,
} from "@/utils/bodyMetrics";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { refreshDailyFood } from "@/store/slices/foodSlice";
import { refreshDailyWater } from "@/store/slices/waterSlice";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { AppState, ScrollView, type AppStateStatus } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./HomeScreen.styles";
import { HomeScrollContent } from "./components/HomeScrollContent";
import type { FoodItemLog } from "@/utils/foodStorage";

export type Gender = "male" | "female";

export type ActivityLevel = "sedentary" | "light" | "moderate" | "active";

export type UserMetrics = {
  name: string;
  heightCm: number;
  weightKg: number;
  age: number;
  gender: Gender;
  activityLevel: ActivityLevel;
};

export function HomeScreen() {
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const dispatch = useAppDispatch();
  const metrics = useAppSelector((s) => s.profile) as UserMetrics | null;
  const waterLiters = useAppSelector((s) => s.water.currentLiters);
  const waterGoal = 3;
  const foodCurrentItems = useAppSelector((s) => s.food.currentItems) as FoodItemLog[];
  const foodCurrentKcal = useMemo(
    () =>
      Math.round(
        foodCurrentItems.reduce(
          (sum: number, item: FoodItemLog) => sum + item.calories * item.qty,
          0,
        ),
      ),
    [foodCurrentItems],
  );

  /** Water/Food day rollover Redux reducers ichida ishlaydi. */
  const refreshDailyTracking = useCallback(() => {
    dispatch(refreshDailyWater());
    dispatch(refreshDailyFood());
  }, [dispatch]);

  useFocusEffect(
    useCallback(() => {
      void refreshDailyTracking();
    }, [refreshDailyTracking]),
  );

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next: AppStateStatus) => {
      if (next === "active") {
        void refreshDailyTracking();
      }
    });
    return () => sub.remove();
  }, [refreshDailyTracking]);

  const stepGoalSteps = useMemo(() => {
    if (!metrics) return 1500;
    const category = getBodyCategory(metrics.weightKg, metrics.heightCm);
    return getDailyStepGoalSteps(category, metrics.gender);
  }, [metrics]);
  const stepCurrentSteps = 0;

  const foodGoalKcal = useMemo(() => {
    if (!metrics) return 2000;
    const bmr = getBMR(
      metrics.weightKg,
      metrics.heightCm,
      metrics.age,
      metrics.gender,
    );
    return Math.max(1200, Math.round(getTDEE(bmr, metrics.activityLevel)));
  }, [metrics]);

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <HomeScrollContent
        scrollRef={scrollRef as any}
        metrics={metrics}
        waterLiters={waterLiters}
        waterGoal={waterGoal}
        foodCurrentKcal={foodCurrentKcal}
        foodGoalKcal={foodGoalKcal}
        onFoodPress={() => router.push("/food")}
        onWaterPress={() => router.push("/water")}
        onStepPress={() => router.push("/step-tracker" as any)}
        onGenerateMealPress={() => router.push("/generate-meal" as any)}
        stepCurrentSteps={stepCurrentSteps}
        stepGoalSteps={stepGoalSteps}
      />
    </SafeAreaView>
  );
}
