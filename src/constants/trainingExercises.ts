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
    title: "O‘tirish — turish",
    subtitle: "5 takror",
    badge: "1-set",
    targetReps: 5,
    hint: "Telefonni uzoqroq qo‘ying, tanangiz butun ko‘rinsin. Chuqur o‘tirib turing.",
    iconName: "human-handsup",
  },
  {
    id: "press",
    title: "Press",
    subtitle: `${10} takror`,
    badge: "2-set",
    targetReps: 10,
    hint: "Tik turing, og‘irlikni boshdan yuqoriga bosing. Tirsak burchagini to‘liq oching.",
    iconName: "dumbbell",
  },
  {
    id: "pushup",
    title: "Adjima",
    subtitle: `${10} takror`,
    badge: "+10",
    targetReps: 10,
    hint: "Tanangizni gorizontal ushlang. Ko‘krakni pastga, keyin to‘liq cho‘zilgan qo‘llarga qaytaring.",
    iconName: "arm-flex",
  },
];
