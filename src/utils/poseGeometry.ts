import type { Landmark } from "react-native-mediapipe";

/** Burchak nuqta B da: A—B—C (2D, normalizatsiyalangan koordinatalar). */
export function angleAtB(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  cx: number,
  cy: number,
): number {
  const bax = ax - bx;
  const bay = ay - by;
  const bcx = cx - bx;
  const bcy = cy - by;
  const dot = bax * bcx + bay * bcy;
  const mba = Math.hypot(bax, bay);
  const mbc = Math.hypot(bcx, bcy);
  if (mba < 1e-8 || mbc < 1e-8) return 180;
  const c = Math.max(-1, Math.min(1, dot / (mba * mbc)));
  return (Math.acos(c) * 180) / Math.PI;
}

export function landmarkOk(lm: Landmark | undefined): boolean {
  if (!lm) return false;
  if (lm.visibility != null && lm.visibility < 0.4) return false;
  if (lm.presence != null && lm.presence < 0.4) return false;
  return true;
}
