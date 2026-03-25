import { KnownPoseLandmarks as K } from "react-native-mediapipe";
import type { Landmark } from "react-native-mediapipe";

export const SQUAT_TARGET_REPS = 5;

/** Burchak nuqta B da: A—B—C */
function angleAtB(
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

function landmarkOk(lm: Landmark | undefined): boolean {
  if (!lm) return false;
  if (lm.visibility != null && lm.visibility < 0.4) return false;
  if (lm.presence != null && lm.presence < 0.4) return false;
  return true;
}

/** Ikkala tizzaning 2D burchagidan o‘rtacha (kamera oldidan turish). */
export function averageKneeAngleDeg(landmarks: Landmark[]): number | null {
  const left = angleAtB(
    landmarks[K.leftHip].x,
    landmarks[K.leftHip].y,
    landmarks[K.leftKnee].x,
    landmarks[K.leftKnee].y,
    landmarks[K.leftAnkle].x,
    landmarks[K.leftAnkle].y,
  );
  const right = angleAtB(
    landmarks[K.rightHip].x,
    landmarks[K.rightHip].y,
    landmarks[K.rightKnee].x,
    landmarks[K.rightKnee].y,
    landmarks[K.rightAnkle].x,
    landmarks[K.rightAnkle].y,
  );

  const L =
    landmarkOk(landmarks[K.leftHip]) &&
    landmarkOk(landmarks[K.leftKnee]) &&
    landmarkOk(landmarks[K.leftAnkle]);
  const R =
    landmarkOk(landmarks[K.rightHip]) &&
    landmarkOk(landmarks[K.rightKnee]) &&
    landmarkOk(landmarks[K.rightAnkle]);

  if (L && R) return (left + right) / 2;
  if (L) return left;
  if (R) return right;
  return null;
}

export type SquatFsmState = {
  phase: "up" | "down";
  count: number;
  downStreak: number;
  upStreak: number;
};

export function createSquatFsm(): SquatFsmState {
  return {
    phase: "up",
    count: 0,
    downStreak: 0,
    upStreak: 0,
  };
}

/** Tizza burchagi kichrayganda “o‘tirdi”, yana kattalashganda 1 ta rep. Gistererezis + ketma-ket freym. */
export function updateSquatFsm(
  fsm: SquatFsmState,
  kneeAngleDeg: number,
  maxReps: number,
  opts?: {
    /** Pastga: burchak bundan kichik bo‘lsa o‘tirish deb hisoblaymiz */
    downBelow?: number;
    /** Yuqoriga: burchak bundan katta bo‘lsa turgan */
    upAbove?: number;
    framesConfirm?: number;
  },
): void {
  if (fsm.count >= maxReps) return;

  const downBelow = opts?.downBelow ?? 128;
  const upAbove = opts?.upAbove ?? 158;
  const n = opts?.framesConfirm ?? 4;

  if (fsm.phase === "up") {
    if (kneeAngleDeg < downBelow) {
      fsm.downStreak++;
      fsm.upStreak = 0;
      if (fsm.downStreak >= n) {
        fsm.phase = "down";
        fsm.downStreak = 0;
      }
    } else {
      fsm.downStreak = 0;
    }
  } else {
    if (kneeAngleDeg > upAbove) {
      fsm.upStreak++;
      fsm.downStreak = 0;
      if (fsm.upStreak >= n) {
        fsm.phase = "up";
        fsm.upStreak = 0;
        fsm.count += 1;
      }
    } else {
      fsm.upStreak = 0;
    }
  }
}
