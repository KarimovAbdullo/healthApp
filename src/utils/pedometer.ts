import { Pedometer } from "expo-sensors";

export type PedometerCapability = {
  available: boolean;
  granted: boolean;
};

export async function checkPedometerCapability(): Promise<PedometerCapability> {
  const available = await Pedometer.isAvailableAsync();
  if (!available) return { available: false, granted: false };

  const perm = await Pedometer.requestPermissionsAsync();
  const granted = perm.status === "granted";
  return { available: true, granted };
}

export async function startPedometer(
  onStepCount: (stepsSinceSubscribe: number) => void,
) {
  return Pedometer.watchStepCount((result) => {
    const safeSteps = Math.max(0, Math.floor(result.steps || 0));
    onStepCount(safeSteps);
  });
}

export function stopPedometer(subscription: { remove: () => void } | null) {
  subscription?.remove();
}

export async function getStepsBetweenDates(start: Date, end: Date): Promise<number> {
  if (end.getTime() <= start.getTime()) return 0;
  const result = await Pedometer.getStepCountAsync(start, end);
  return Math.max(0, Math.floor(result.steps || 0));
}
