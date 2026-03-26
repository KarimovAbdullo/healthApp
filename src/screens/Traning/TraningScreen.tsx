import { TrainingCameraSession } from "@/components/Training/TrainingCameraSession";
import { TrainingExercisePicker } from "@/components/Training/TrainingExercisePicker";
import type { TrainingExerciseDef } from "@/constants/trainingExercises";
import { useCallback, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function TraningScreen() {
  const [activeExercise, setActiveExercise] =
    useState<TrainingExerciseDef | null>(null);

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
        <TrainingExercisePicker onSelect={setActiveExercise} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0618" },
  safe: { flex: 1 },
});
