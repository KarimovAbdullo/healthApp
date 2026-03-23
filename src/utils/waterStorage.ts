import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

export type WaterHistoryItem = {
  date: string; // YYYY-MM-DD
  liters: number;
};

export type WaterState = {
  currentDate: string; // YYYY-MM-DD
  currentLiters: number;
  history: WaterHistoryItem[];
};

const WATER_STORAGE_KEY = "water-tracking";

function todayKey(): string {
  return moment().format("YYYY-MM-DD");
}

export async function loadWaterState(): Promise<WaterState> {
  const today = todayKey();
  const raw = await AsyncStorage.getItem(WATER_STORAGE_KEY);

  if (!raw) {
    const initial: WaterState = { currentDate: today, currentLiters: 0, history: [] };
    await AsyncStorage.setItem(WATER_STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  const parsed = JSON.parse(raw) as Partial<WaterState>;
  let currentDate = parsed.currentDate ?? today;
  let currentLiters = typeof parsed.currentLiters === "number" ? parsed.currentLiters : 0;
  let history: WaterHistoryItem[] = Array.isArray(parsed.history) ? parsed.history : [];

  // Day rollover: move yesterday to history and reset.
  if (currentDate !== today) {
    if (currentLiters > 0) {
      history = [...history, { date: currentDate, liters: currentLiters }];
    }
    currentDate = today;
    currentLiters = 0;
  }

  const state: WaterState = { currentDate, currentLiters, history };
  await AsyncStorage.setItem(WATER_STORAGE_KEY, JSON.stringify(state));
  return state;
}

export async function setTodayWaterLiters(liters: number): Promise<WaterState> {
  const state = await loadWaterState();
  const next: WaterState = {
    ...state,
    currentLiters: Number(liters.toFixed(1)),
  };
  await AsyncStorage.setItem(WATER_STORAGE_KEY, JSON.stringify(next));
  return next;
}

export async function addTodayWaterLiters(added: number): Promise<WaterState> {
  const state = await loadWaterState();
  const nextLiters = Number((state.currentLiters + added).toFixed(1));
  const next: WaterState = { ...state, currentLiters: nextLiters };
  await AsyncStorage.setItem(WATER_STORAGE_KEY, JSON.stringify(next));
  return next;
}

export async function clearWaterTracking(): Promise<void> {
  await AsyncStorage.removeItem(WATER_STORAGE_KEY);
}

