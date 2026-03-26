import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type DailyResultsState = {
  /** First day we show history from (YYYY-MM-DD). Set on onboarding or inferred from legacy data. */
  usageStartDate: string | null;
  stepsByDate: Record<string, number>;
  fitnessRepsByDate: Record<string, number>;
  /** Per exercise, per day reps (date -> exerciseId -> reps). */
  fitnessRepsByDateByExercise: Record<string, Record<string, number>>;
};

const initialState: DailyResultsState = {
  usageStartDate: null,
  stepsByDate: {},
  fitnessRepsByDate: {},
  fitnessRepsByDateByExercise: {},
};

const dailyResultsSlice = createSlice({
  name: "dailyResults",
  initialState,
  reducers: {
    setUsageStartDateIfEmpty(state, action: PayloadAction<string>) {
      if (state.usageStartDate == null) {
        state.usageStartDate = action.payload;
      }
    },
    setUsageStartDate(state, action: PayloadAction<string>) {
      state.usageStartDate = action.payload;
    },
    recordStepsForDate(
      state,
      action: PayloadAction<{ date: string; steps: number }>,
    ) {
      const { date, steps } = action.payload;
      const next = Math.max(0, Math.floor(steps));
      const prev = state.stepsByDate[date] ?? 0;
      state.stepsByDate[date] = Math.max(prev, next);
    },
    addFitnessRepsForDate(
      state,
      action: PayloadAction<{ date: string; reps: number }>,
    ) {
      const { date, reps } = action.payload;
      const add = Math.max(0, Math.floor(reps));
      if (add <= 0) return;
      state.fitnessRepsByDate[date] =
        (state.fitnessRepsByDate[date] ?? 0) + add;
    },
    addFitnessRepsForExerciseDate(
      state,
      action: PayloadAction<{
        date: string;
        exerciseId: string;
        reps: number;
      }>,
    ) {
      const { date, exerciseId, reps } = action.payload;
      const add = Math.max(0, Math.floor(reps));
      if (add <= 0) return;

      const prevByExercise = state.fitnessRepsByDateByExercise[date] ?? {};
      state.fitnessRepsByDateByExercise[date] = {
        ...prevByExercise,
        [exerciseId]: Math.max(0, (prevByExercise[exerciseId] ?? 0) + add),
      };

      // Keep aggregate for the Results tab.
      state.fitnessRepsByDate[date] =
        (state.fitnessRepsByDate[date] ?? 0) + add;
    },
    clearDailyResults() {
      return initialState;
    },
  },
});

export const {
  setUsageStartDateIfEmpty,
  setUsageStartDate,
  recordStepsForDate,
  addFitnessRepsForDate,
  addFitnessRepsForExerciseDate,
  clearDailyResults,
} = dailyResultsSlice.actions;

export default dailyResultsSlice.reducer;
