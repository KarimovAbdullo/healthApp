import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

export type FoodItemLog = {
  id: string;
  name: string;
  unit: string;
  calories: number;
  qty: number;
};

export type FoodHistoryItem = {
  date: string; // YYYY-MM-DD
  totalCalories: number;
  items: FoodItemLog[];
};

export type FoodState = {
  currentDate: string;
  currentItems: FoodItemLog[];
  history: FoodHistoryItem[];
};

const FOOD_STORAGE_KEY = "food-tracking";

function todayKey(): string {
  return moment().format("YYYY-MM-DD");
}

function totalCalories(items: FoodItemLog[]): number {
  return items.reduce((sum, item) => sum + item.calories * item.qty, 0);
}

function normalizeItems(items: unknown): FoodItemLog[] {
  if (!Array.isArray(items)) return [];
  return items
    .filter((x) => !!x && typeof x === "object")
    .map((x) => x as Partial<FoodItemLog>)
    .filter(
      (x): x is FoodItemLog =>
        typeof x.id === "string" &&
        typeof x.name === "string" &&
        typeof x.unit === "string" &&
        typeof x.calories === "number" &&
        typeof x.qty === "number",
    )
    .filter((x) => x.qty > 0);
}

function normalizeHistory(history: unknown): FoodHistoryItem[] {
  if (!Array.isArray(history)) return [];
  return history
    .filter((x) => !!x && typeof x === "object")
    .map((x) => x as Partial<FoodHistoryItem>)
    .filter(
      (x): x is FoodHistoryItem =>
        typeof x.date === "string" &&
        typeof x.totalCalories === "number" &&
        Array.isArray(x.items),
    )
    .map((x) => ({
      ...x,
      items: normalizeItems(x.items),
      totalCalories: Math.round(x.totalCalories),
    }));
}

export async function loadFoodState(): Promise<FoodState> {
  const today = todayKey();
  const raw = await AsyncStorage.getItem(FOOD_STORAGE_KEY);

  if (!raw) {
    const initial: FoodState = { currentDate: today, currentItems: [], history: [] };
    await AsyncStorage.setItem(FOOD_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  const parsed = JSON.parse(raw) as Partial<FoodState>;
  let currentDate = parsed.currentDate ?? today;
  let currentItems = normalizeItems(parsed.currentItems);
  let history = normalizeHistory(parsed.history);

  // Day rollover: move yesterday's foods into history and reset current day.
  if (currentDate !== today) {
    if (currentItems.length > 0) {
      history = [
        ...history,
        {
          date: currentDate,
          totalCalories: Math.round(totalCalories(currentItems)),
          items: currentItems,
        },
      ];
    }
    currentDate = today;
    currentItems = [];
  }

  const state: FoodState = { currentDate, currentItems, history };
  await AsyncStorage.setItem(FOOD_STORAGE_KEY, JSON.stringify(state));
  return state;
}

export async function setTodayFoodItems(items: FoodItemLog[]): Promise<FoodState> {
  const state = await loadFoodState();
  const next: FoodState = {
    ...state,
    currentItems: normalizeItems(items),
  };
  await AsyncStorage.setItem(FOOD_STORAGE_KEY, JSON.stringify(next));
  return next;
}

