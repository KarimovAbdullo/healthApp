const FALLBACK_STEP_LENGTH_M = 0.7;

export function calculateDistance(steps: number, heightCm?: number): number {
  const safeSteps = Math.max(0, Math.floor(steps));
  const validHeight = typeof heightCm === "number" && heightCm > 0 ? heightCm : null;
  const stepLengthM = validHeight ? (validHeight / 100) * 0.415 : FALLBACK_STEP_LENGTH_M;
  return safeSteps * stepLengthM;
}

/** One decimal so sub‑1 m progress is visible (hardware reports whole steps only). */
export function formatDistanceMetersLive(meters: number): string {
  const m = Math.max(0, meters);
  return `${m.toFixed(1)} m`;
}
