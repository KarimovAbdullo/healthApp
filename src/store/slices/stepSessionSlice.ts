import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { StepSession } from "@/utils/storage";

export type StepSessionState = StepSession | null;

const initialState: StepSessionState = null;

const stepSessionSlice = createSlice({
  name: "stepSession",
  initialState,
  reducers: {
    hydrateStepSessionFromLegacy(_state, action: PayloadAction<StepSession>) {
      return action.payload;
    },
    startSession(state, action: PayloadAction<{ startTimeISO: string }>) {
      return { startTimeISO: action.payload.startTimeISO, lastTotalSteps: 0 };
    },
    updateSessionSteps(state, action: PayloadAction<number>) {
      if (!state) return state;
      const next = Math.max(0, Math.floor(action.payload));
      return { ...state, lastTotalSteps: next };
    },
    clearSession(_state, _action: PayloadAction<void>) {
      return initialState;
    },
  },
});

export const {
  hydrateStepSessionFromLegacy,
  startSession,
  updateSessionSteps,
  clearSession,
} = stepSessionSlice.actions;

export default stepSessionSlice.reducer;

