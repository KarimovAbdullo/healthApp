import AsyncStorage from "@react-native-async-storage/async-storage";

const STEP_SESSION_KEY = "step_tracker_active_session_v1";

export type StepSession = {
  startTimeISO: string;
};

export async function saveStartTime(startTime: Date): Promise<void> {
  const payload: StepSession = { startTimeISO: startTime.toISOString() };
  await AsyncStorage.setItem(STEP_SESSION_KEY, JSON.stringify(payload));
}

export async function getStartTime(): Promise<Date | null> {
  const raw = await AsyncStorage.getItem(STEP_SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<StepSession>;
    if (!parsed.startTimeISO || typeof parsed.startTimeISO !== "string") {
      return null;
    }
    const date = new Date(parsed.startTimeISO);
    if (Number.isNaN(date.getTime())) return null;
    return date;
  } catch {
    return null;
  }
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(STEP_SESSION_KEY);
}
