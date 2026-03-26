import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";
import type { WaterState } from "@/utils/waterStorage";
import type { WaterHistoryItem } from "@/utils/waterStorage";

const todayKey = () => moment().format("YYYY-MM-DD");

const normalizeToToday = (state: WaterState): WaterState => {
  const today = todayKey();
  if (state.currentDate === today) return state;

  let history: WaterHistoryItem[] = state.history ?? [];
  const prevDate = state.currentDate;
  const prevLiters = state.currentLiters ?? 0;

  if (prevLiters > 0) {
    history = [...history, { date: prevDate, liters: prevLiters }];
  }

  return { currentDate: today, currentLiters: 0, history };
};

const initialState: WaterState = {
  currentDate: todayKey(),
  currentLiters: 0,
  history: [],
};

const waterSlice = createSlice({
  name: "water",
  initialState,
  reducers: {
    hydrateWaterFromLegacy(state, action: PayloadAction<WaterState>) {
      return normalizeToToday(action.payload);
    },
    refreshDailyWater(state) {
      return normalizeToToday(state);
    },
    setTodayWaterLiters(state, action: PayloadAction<number>) {
      state = normalizeToToday(state);
      state.currentLiters = Number(action.payload.toFixed(1));
      return state;
    },
    addTodayWaterLiters(state, action: PayloadAction<number>) {
      state = normalizeToToday(state);
      const added = Number(action.payload.toFixed(1));
      state.currentLiters = Number((state.currentLiters + added).toFixed(1));
      return state;
    },
    clearWaterTracking(_state) {
      return initialState;
    },
  },
});

export const {
  hydrateWaterFromLegacy,
  refreshDailyWater,
  setTodayWaterLiters,
  addTodayWaterLiters,
  clearWaterTracking,
} = waterSlice.actions;

export default waterSlice.reducer;

