import {
  calculateDailyWalk,
  getBMR,
  getTDEE,
} from "@/utils/bodyMetrics";
import { loadFoodState } from "@/utils/foodStorage";
import { loadWaterState } from "@/utils/waterStorage";
import { loadUserProfile, saveUserProfile } from "@/utils/userProfileStorage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppState, type AppStateStatus, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./HomeScreen.styles";
import { SetupModal } from "./components/SetupModal";
import { HomeScrollContent } from "./components/HomeScrollContent";

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
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [isSetupVisible, setIsSetupVisible] = useState(false);

  const [waterLiters, setWaterLiters] = useState(0);
  const waterGoal = 3;
  const [foodCurrentKcal, setFoodCurrentKcal] = useState(0);

  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | "">("");

  useEffect(() => {
    let alive = true;
    (async () => {
      const saved = await loadUserProfile();
      if (!alive) return;
      if (!saved) {
        setIsSetupVisible(true);
        return;
      }
      setMetrics(saved);
      setName(saved.name);
      setHeight(String(saved.heightCm));
      setWeight(String(saved.weightKg));
      setAge(String(saved.age));
      setGender(saved.gender);
      setActivityLevel(saved.activityLevel);
      setIsSetupVisible(false);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const heightNum = Number(height);
  const weightNum = Number(weight);
  const ageNum = Number(age);

  /** Reload water + food from AsyncStorage (applies midnight rollover inside loaders). */
  const refreshDailyTracking = useCallback(async () => {
    try {
      const [water, food] = await Promise.all([loadWaterState(), loadFoodState()]);
      setWaterLiters(water.currentLiters);
      const kcal = food.currentItems.reduce(
        (sum, item) => sum + item.calories * item.qty,
        0,
      );
      setFoodCurrentKcal(Math.round(kcal));
    } catch {
      // ignore
    }
  }, []);

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

  const canConfirm =
    name.trim().length > 0 &&
    name.trim().length <= 9 &&
    !!heightNum &&
    !!weightNum &&
    !!ageNum &&
    heightNum >= 50 &&
    weightNum >= 45 &&
    weightNum <= 160 &&
    age.trim().length > 0 &&
    (gender === "male" || gender === "female") &&
    ["sedentary", "light", "moderate", "active"].includes(activityLevel);

  const handleConfirm = () => {
    if (!canConfirm) return;
    if (
      !(gender === "male" || gender === "female") ||
      !["sedentary", "light", "moderate", "active"].includes(activityLevel)
    )
      return;
    const nextMetrics = {
      name: name.trim(),
      heightCm: heightNum,
      weightKg: weightNum,
      age: ageNum,
      gender,
      activityLevel: activityLevel as ActivityLevel,
    };
    setMetrics(nextMetrics);
    void saveUserProfile(nextMetrics);
    setIsSetupVisible(false);
  };

  const stepWalk = useMemo(() => {
    if (!metrics) return null;
    return calculateDailyWalk({
      weight: metrics.weightKg,
      height: metrics.heightCm,
      activityLevel: metrics.activityLevel,
    });
  }, [metrics]);

  /** ~1200 steps per km — softer goal than 1300 */
  const stepGoalSteps = stepWalk ? Math.max(2000, Math.round(stepWalk.dailyKm * 1200)) : 5000;
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

  const handleOpenEdit = () => {
    if (metrics) {
      setName(metrics.name);
      setHeight(String(metrics.heightCm));
      setWeight(String(metrics.weightKg));
      setAge(String(metrics.age));
      setGender(metrics.gender);
      setActivityLevel(metrics.activityLevel);
    }
    setIsSetupVisible(true);
  };

  return (
    <>
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <HomeScrollContent
          scrollRef={scrollRef as any}
          metrics={metrics}
          onEditPress={handleOpenEdit}
          waterLiters={waterLiters}
          waterGoal={waterGoal}
          foodCurrentKcal={foodCurrentKcal}
          foodGoalKcal={foodGoalKcal}
          onFoodPress={() => router.push("/food")}
          onWaterPress={() => router.push("/water")}
          onStepPress={() => router.push("/step-tracker" as any)}
          stepCurrentSteps={stepCurrentSteps}
          stepGoalSteps={stepGoalSteps}
        />
      </SafeAreaView>

      <SetupModal
        visible={isSetupVisible}
        // canConfirm={canConfirm}
        name={name}
        height={height}
        weight={weight}
        age={age}
        gender={gender}
        activityLevel={activityLevel}
        onChangeName={setName}
        onChangeHeight={setHeight}
        onChangeWeight={setWeight}
        onChangeAge={setAge}
        onSelectGender={setGender}
        onSelectActivity={setActivityLevel}
        onConfirm={handleConfirm}
      />
    </>
  );
}
