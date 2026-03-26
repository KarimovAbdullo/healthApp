import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import moment from "moment";
import type { FoodItemLog, FoodHistoryItem, FoodState } from "@/utils/foodStorage";

const todayKey = () => moment().format("YYYY-MM-DD");

const totalCalories = (items: FoodItemLog[]) =>
  items.reduce((sum, item) => sum + item.calories * item.qty, 0);

const initialState: FoodState = {
  currentDate: todayKey(),
  currentItems: [],
  history: [],
};

const normalizeToToday = (state: FoodState): FoodState => {
  const today = todayKey();
  if (state.currentDate === today) return state;

  // Day rollover: push previous day into history if there was anything logged.
  const history: FoodHistoryItem[] = [...(state.history ?? [])];
  const prevDate = state.currentDate;
  const prevItems = state.currentItems ?? [];
  if (prevItems.length > 0) {
    history.push({
      date: prevDate,
      totalCalories: Math.round(totalCalories(prevItems)),
      items: prevItems,
    });
  }

  return { currentDate: today, currentItems: [], history };
};

const foodSlice = createSlice({
  name: "food",
  initialState,
  reducers: {
    hydrateFoodFromLegacy(state, action: PayloadAction<FoodState>) {
      return normalizeToToday(action.payload);
    },
    refreshDailyFood(state) {
      return normalizeToToday(state);
    },
    setTodayFoodItems(state, action: PayloadAction<FoodItemLog[]>) {
      state = normalizeToToday(state);
      state.currentItems = action.payload;
      return state;
    },
    clearFoodTracking(_state) {
      return initialState;
    },
  },
});

export const {
  hydrateFoodFromLegacy,
  refreshDailyFood,
  setTodayFoodItems,
  clearFoodTracking,
} = foodSlice.actions;

export default foodSlice.reducer;

