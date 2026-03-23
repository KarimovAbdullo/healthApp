import {
  getBodyCategory,
  getBMR,
  getDailyStepGoalSteps,
  getTDEE,
} from "@/utils/bodyMetrics";
import { AppText } from "@/components/AppText";
import { clearSession } from "@/utils/storage";
import { clearFoodTracking, loadFoodState } from "@/utils/foodStorage";
import { clearWaterTracking, loadWaterState } from "@/utils/waterStorage";
import { loadUserProfile, saveUserProfile } from "@/utils/userProfileStorage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  AppState,
  InteractionManager,
  Modal,
  ScrollView,
  TouchableOpacity,
  View,
  type AppStateStatus,
} from "react-native";
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
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [pendingMetrics, setPendingMetrics] = useState<UserMetrics | null>(null);

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

    const isEditing = metrics !== null;
    const hasChanged =
      !metrics ||
      metrics.name !== nextMetrics.name ||
      metrics.heightCm !== nextMetrics.heightCm ||
      metrics.weightKg !== nextMetrics.weightKg ||
      metrics.age !== nextMetrics.age ||
      metrics.gender !== nextMetrics.gender ||
      metrics.activityLevel !== nextMetrics.activityLevel;

    if (isEditing && hasChanged) {
      setPendingMetrics(nextMetrics);
      // iOS: fullscreen Modal ustida ikkinchi Modal ko‘rinmaydi — avval Setup yopiladi.
      setIsSetupVisible(false);
      InteractionManager.runAfterInteractions(() => {
        setTimeout(() => setShowResetConfirm(true), 320);
      });
      return;
    }

    setMetrics(nextMetrics);
    void saveUserProfile(nextMetrics);
    setIsSetupVisible(false);
  };

  const handleConfirmReset = async () => {
    if (!pendingMetrics) {
      setShowResetConfirm(false);
      return;
    }

    await Promise.all([
      saveUserProfile(pendingMetrics),
      clearFoodTracking(),
      clearWaterTracking(),
      clearSession(),
    ]);

    setMetrics(pendingMetrics);
    setFoodCurrentKcal(0);
    setWaterLiters(0);
    setPendingMetrics(null);
    setShowResetConfirm(false);
    setIsSetupVisible(false);
    void refreshDailyTracking();
  };

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
          onGenerateMealPress={() => router.push("/generate-meal" as any)}
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

      <Modal
        visible={showResetConfirm}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {
          setShowResetConfirm(false);
          setPendingMetrics(null);
          setIsSetupVisible(true);
        }}
      >
        <View style={localStyles.overlay}>
          <View style={localStyles.card}>
            <AppText size={22} weight="bold" color="#F9FAFB">
              Data will be updated
            </AppText>
            <AppText size={14} color="#E5E7EB" style={localStyles.body}>
              All previous data will be updated and saved values in Water, Food, and Step
              trackers including histories will be cleared.
            </AppText>
            <View style={localStyles.actions}>
              <TouchableOpacity
                style={[localStyles.btn, localStyles.cancelBtn]}
                onPress={() => {
                  setShowResetConfirm(false);
                  setPendingMetrics(null);
                  setIsSetupVisible(true);
                }}
                activeOpacity={0.85}
              >
                <AppText size={15} weight="semibold" color="#F9FAFB">
                  Cancel
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[localStyles.btn, localStyles.okBtn]}
                onPress={() => {
                  void handleConfirmReset();
                }}
                activeOpacity={0.85}
              >
                <AppText size={15} weight="bold" color="#0F172A">
                  OK
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

const localStyles = {
  overlay: {
    flex: 1,
    backgroundColor: "rgba(2,6,23,0.68)",
    justifyContent: "center" as const,
    paddingHorizontal: 22,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "rgba(15,23,42,0.95)",
    padding: 16,
  },
  body: {
    marginTop: 10,
    lineHeight: 21,
  },
  actions: {
    marginTop: 14,
    flexDirection: "row" as const,
    gap: 10,
  },
  btn: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },
  cancelBtn: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.22)",
    backgroundColor: "rgba(30,41,59,0.85)",
  },
  okBtn: {
    backgroundColor: "#FACC15",
  },
};
