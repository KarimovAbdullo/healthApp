export type TrainingExerciseId = "squat" | "press" | "pushup";

export type TrainingExerciseDef = {
  id: TrainingExerciseId;
  title: string;
  subtitle: string;
  badge: string;
  targetReps: number;
  hint: string;
  iconName: "human-handsup" | "dumbbell" | "arm-flex";
};

export const TRAINING_EXERCISES: TrainingExerciseDef[] = [
  {
    id: "squat",
    title: "Squat",
    subtitle: "5 reps",
    badge: "Set 1",
    targetReps: 5,
    hint: "Keep your full body visible. Go down deep, then stand up fully.",
    iconName: "human-handsup",
  },
  {
    id: "press",
    title: "Crunch",
    subtitle: `${10} reps`,
    badge: "Set 2",
    targetReps: 10,
    hint: "Lie on your side and lift your torso slightly up, then lower down.",
    iconName: "dumbbell",
  },
  {
    id: "pushup",
    title: "Push-up",
    subtitle: `${10} reps`,
    badge: "Set 3",
    targetReps: 10,
    hint: "Keep your body straight. Lower your chest, then push back up fully.",
    iconName: "arm-flex",
  },
];
