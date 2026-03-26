import { KnownPoseLandmarks as K } from "react-native-mediapipe";
import type { Landmark } from "react-native-mediapipe";
import {
  createAngleRepFsm,
  updateAngleRepFsm,
  type AngleRepFsmState,
} from "@/utils/angleRepFsm";
import { landmarkOk } from "@/utils/poseGeometry";

export const PRESS_TARGET_REPS = 10;

export const pressRepThresholds = {
  // "Yotgan" holatda torso ko'tarilishi farqi (0..1) ni 0..180 ga scale qilib ishlatamiz.
  lowBelow: 14, // taxm. torso lift < 0.08
  highAbove: 23, // taxm. torso lift > 0.13
  frames: 3,
} as const;

/**
 * Press (abs crunch) uchun: odam yon tomonda yotadi, gavda deyarli gorizontal.
 * Yelka-sona vertikal farqi katta bo'lmasligi kerak.
 */
export function isLikelyLyingPressPose(landmarks: Landmark[]): boolean {
  if (
    !landmarkOk(landmarks[K.leftShoulder]) ||
    !landmarkOk(landmarks[K.rightShoulder]) ||
    !landmarkOk(landmarks[K.leftHip]) ||
    !landmarkOk(landmarks[K.rightHip])
  ) {
    return false;
  }
  const shoulderY = (landmarks[K.leftShoulder].y + landmarks[K.rightShoulder].y) / 2;
  const hipY = (landmarks[K.leftHip].y + landmarks[K.rightHip].y) / 2;
  const torsoDeltaY = Math.abs(hipY - shoulderY);
  return torsoDeltaY < 0.16;
}

export type PressFsmState = AngleRepFsmState;

export const createPressFsm = createAngleRepFsm;

/**
 * Crunch amplitudasi: sonlar yelkadan qancha past bo'lsa (hipY - shoulderY),
 * shuncha yuqori qiymat.
 */
function torsoLiftSignal(landmarks: Landmark[]): number | null {
  if (
    !landmarkOk(landmarks[K.leftShoulder]) ||
    !landmarkOk(landmarks[K.rightShoulder]) ||
    !landmarkOk(landmarks[K.leftHip]) ||
    !landmarkOk(landmarks[K.rightHip])
  ) {
    return null;
  }
  const shoulderY = (landmarks[K.leftShoulder].y + landmarks[K.rightShoulder].y) / 2;
  const hipY = (landmarks[K.leftHip].y + landmarks[K.rightHip].y) / 2;
  // Manfiy holatlarni nolga qisamiz, chunki crunchda asosiy signal yuqoriga ko'tarilish.
  return Math.max(0, hipY - shoulderY);
}

export function updatePressFsm(
  fsm: PressFsmState,
  landmarks: Landmark[],
  maxReps: number,
  opts?: Partial<typeof pressRepThresholds>,
): void {
  const lift = torsoLiftSignal(landmarks);
  if (lift == null) return;
  const liftScaled = lift * 180;
  updateAngleRepFsm(fsm, liftScaled, maxReps, {
    lowBelow: opts?.lowBelow ?? pressRepThresholds.lowBelow,
    highAbove: opts?.highAbove ?? pressRepThresholds.highAbove,
    frames: opts?.frames ?? pressRepThresholds.frames,
  });
}
