import {
  TRAINING_EXERCISES,
  type TrainingExerciseDef,
} from "@/constants/trainingExercises";
import { LinearGradient } from "expo-linear-gradient";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { TrainingExerciseCard } from "./TrainingExerciseCard";

type Props = {
  onSelect: (exercise: TrainingExerciseDef) => void;
};

export function TrainingExercisePicker({ onSelect }: Props) {
  return (
    <LinearGradient
      colors={["#0f0720", "#1a0a2e", "#12082a"]}
      style={styles.gradient}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>3 mashq</Text>
        <Text style={styles.subheading}>
          Tanangizni kuzatib, takrorlarni avtomatik sanaymiz. Kartani yoki play
          tugmasini bosing.
        </Text>
        {TRAINING_EXERCISES.map((ex) => (
          <TrainingExerciseCard
            key={ex.id}
            exercise={ex}
            onPlay={() => onSelect(ex)}
          />
        ))}
        <View style={{ height: 24 }} />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scroll: {
    paddingTop: 8,
    paddingBottom: 32,
  },
  heading: {
    marginHorizontal: 22,
    marginTop: 12,
    fontSize: 32,
    fontWeight: "900",
    color: "#f8fafc",
    letterSpacing: -0.5,
  },
  subheading: {
    marginHorizontal: 22,
    marginTop: 8,
    marginBottom: 20,
    fontSize: 15,
    lineHeight: 22,
    color: "rgba(203, 213, 225, 0.88)",
    fontWeight: "500",
  },
});
