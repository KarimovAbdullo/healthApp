import AsyncStorage from "@react-native-async-storage/async-storage";

const STEP_SESSION_KEY = "step_tracker_active_session_v1";

export type StepSession = {
  startTimeISO: string;
  /** Persisted total for platforms where historical step range is unavailable (Android). */
  lastTotalSteps?: number;
};

export async function saveStartTime(startTime: Date): Promise<void> {
  const payload: StepSession = {
    startTimeISO: startTime.toISOString(),
    lastTotalSteps: 0,
  };
  await AsyncStorage.setItem(STEP_SESSION_KEY, JSON.stringify(payload));
}

export async function getSession(): Promise<StepSession | null> {
  const raw = await AsyncStorage.getItem(STEP_SESSION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<StepSession>;
    if (!parsed.startTimeISO || typeof parsed.startTimeISO !== "string") {
      return null;
    }
    const date = new Date(parsed.startTimeISO);
    if (Number.isNaN(date.getTime())) return null;
    const last =
      typeof parsed.lastTotalSteps === "number"
        ? Math.max(0, Math.floor(parsed.lastTotalSteps))
        : undefined;
    return { startTimeISO: parsed.startTimeISO, lastTotalSteps: last };
  } catch {
    return null;
  }
}

export async function updateSessionSteps(totalSteps: number): Promise<void> {
  const raw = await AsyncStorage.getItem(STEP_SESSION_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw) as StepSession;
    if (!parsed.startTimeISO) return;
    await AsyncStorage.setItem(
      STEP_SESSION_KEY,
      JSON.stringify({
        ...parsed,
        lastTotalSteps: Math.max(0, Math.floor(totalSteps)),
      }),
    );
  } catch {
    // ignore
  }
}

export async function getStartTime(): Promise<Date | null> {
  const session = await getSession();
  if (!session) return null;
  const date = new Date(session.startTimeISO);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function clearSession(): Promise<void> {
  await AsyncStorage.removeItem(STEP_SESSION_KEY);
}
