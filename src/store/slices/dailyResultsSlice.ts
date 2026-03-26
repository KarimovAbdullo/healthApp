import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type DailyResultsState = {
  /** First day we show history from (YYYY-MM-DD). Set on onboarding or inferred from legacy data. */
  usageStartDate: string | null;
  stepsByDate: Record<string, number>;
  fitnessRepsByDate: Record<string, number>;
};

const initialState: DailyResultsState = {
  usageStartDate: null,
  stepsByDate: {},
  fitnessRepsByDate: {},
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
  clearDailyResults,
} = dailyResultsSlice.actions;

export default dailyResultsSlice.reducer;
