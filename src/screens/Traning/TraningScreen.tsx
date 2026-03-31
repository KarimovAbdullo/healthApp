import { TrainingCameraSession } from "@/components/Training/TrainingCameraSession";
import { TrainingExercisePicker } from "@/components/Training/TrainingExercisePicker";
import {
  TRAINING_EXERCISES,
  type TrainingExerciseDef,
} from "@/constants/trainingExercises";
import { useAppSelector } from "@/store/hooks";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

function adjustedReps(base: number, gender?: "male" | "female", age?: number): number {
  let reduction = 0;
  if (gender === "female") reduction += 1;
  if ((age ?? 0) > 40) reduction += 2;
  return Math.max(3, base - reduction);
}

export default function TraningScreen() {
  const { t } = useTranslation();
  const profile = useAppSelector((s) => s.profile);
  const [activeExercise, setActiveExercise] =
    useState<TrainingExerciseDef | null>(null);

  const exercises = useMemo(() => {
    return TRAINING_EXERCISES.map((ex) => {
      const reps = adjustedReps(ex.targetReps, profile?.gender, profile?.age);
      const localizedTitle =
        ex.id === "squat"
          ? t("training.exercises.squat")
          : ex.id === "press"
            ? t("training.exercises.crunch")
            : t("training.exercises.pushup");
      const localizedBadge =
        ex.id === "squat"
          ? t("training.exercises.set1")
          : ex.id === "press"
            ? t("training.exercises.set2")
            : t("training.exercises.set3");
      const localizedHint =
        ex.id === "squat"
          ? t("training.exercises.hintSquat")
          : ex.id === "press"
            ? t("training.exercises.hintPress")
            : t("training.exercises.hintPushup");
      return {
        ...ex,
        title: localizedTitle,
        badge: localizedBadge,
        hint: localizedHint,
        targetReps: reps,
        subtitle: `${reps} ${t("training.reps")}`,
      };
    });
  }, [profile?.age, profile?.gender, t]);

  const handleCloseSession = useCallback(() => {
    setActiveExercise(null);
  }, []);

  return (
    <View style={styles.root}>
      {activeExercise ? (
        <TrainingCameraSession
          key={activeExercise.id}
          exercise={activeExercise}
          onClose={handleCloseSession}
        />
      ) : (
        <TrainingExercisePicker exercises={exercises} onSelect={setActiveExercise} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0618" },
  safe: { flex: 1 },
});
