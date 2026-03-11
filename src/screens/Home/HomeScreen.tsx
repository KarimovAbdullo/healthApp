import FoodTracker from "@/components/FoodTracker/FoodTracker";
import { useRef, useState } from "react";
import {
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "./HomeScreen.styles";
import Header from "./components/Header";
import { SetupModal } from "./components/SetupModal";

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
  const scrollRef = useRef<ScrollView>(null);
  const [metrics, setMetrics] = useState<UserMetrics | null>(null);
  const [isSetupVisible, setIsSetupVisible] = useState(true);

  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState<Gender | "">("");
  const [activityLevel, setActivityLevel] = useState<ActivityLevel | "">("");

  const heightNum = Number(height);
  const weightNum = Number(weight);
  const ageNum = Number(age);

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
    setMetrics({
      name: name.trim(),
      heightCm: heightNum,
      weightKg: weightNum,
      age: ageNum,
      gender,
      activityLevel: activityLevel as ActivityLevel,
    });
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
        <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
          <Header metrics={metrics} onEditPress={handleOpenEdit} />
          <FoodTracker breakfast={0} current={900} totalCalories={1800} />
        </ScrollView>
      </SafeAreaView>

      <SetupModal
        visible={isSetupVisible}
        canConfirm={canConfirm}
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
