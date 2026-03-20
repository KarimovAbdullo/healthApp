import { loadWaterState } from "@/utils/waterStorage";
import { loadUserProfile, saveUserProfile } from "@/utils/userProfileStorage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./HomeScreen.styles";
import Header from "./components/Header";
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

  useFocusEffect(
    useCallback(() => {
      let alive = true;
      (async () => {
        try {
          const state = await loadWaterState();
          if (!alive) return;
          setWaterLiters(state.currentLiters);
        } catch {
          // ignore
        }
      })();
      return () => {
        alive = false;
      };
    }, []),
  );

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
          onFoodPress={() => router.push("/food")}
          onWaterPress={() => router.push("/water")}
          onStepPress={() => router.push("/step-tracker" as any)}
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
