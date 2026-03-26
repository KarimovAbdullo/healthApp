import { KnownPoseLandmarks as K } from "react-native-mediapipe";
import type { Landmark } from "react-native-mediapipe";
import {
  createAngleRepFsm,
  updateAngleRepFsm,
  type AngleRepFsmState,
} from "@/utils/angleRepFsm";
import { angleAtB, landmarkOk } from "@/utils/poseGeometry";

export const PUSHUP_TARGET_REPS = 10;

export const pushupRepThresholds = {
  lowBelow: 118,
  highAbove: 152,
  frames: 4,
} as const;

/** Tirsak burchagi: yelka — tirsak — bilak. */
export function averageElbowAngleDeg(landmarks: Landmark[]): number | null {
  const left = angleAtB(
    landmarks[K.leftShoulder].x,
    landmarks[K.leftShoulder].y,
    landmarks[K.leftElbow].x,
    landmarks[K.leftElbow].y,
    landmarks[K.leftWrist].x,
    landmarks[K.leftWrist].y,
  );
  const right = angleAtB(
    landmarks[K.rightShoulder].x,
    landmarks[K.rightShoulder].y,
    landmarks[K.rightElbow].x,
    landmarks[K.rightElbow].y,
    landmarks[K.rightWrist].x,
    landmarks[K.rightWrist].y,
  );

  const L =
    landmarkOk(landmarks[K.leftShoulder]) &&
    landmarkOk(landmarks[K.leftElbow]) &&
    landmarkOk(landmarks[K.leftWrist]);
  const R =
    landmarkOk(landmarks[K.rightShoulder]) &&
    landmarkOk(landmarks[K.rightElbow]) &&
    landmarkOk(landmarks[K.rightWrist]);

  if (L && R) return (left + right) / 2;
  if (L) return left;
  if (R) return right;
  return null;
}

/** Yelka va sonning Y yaqin — taxminan gorizontal tana (adjima plank). */
export function isLikelyPushupPose(landmarks: Landmark[]): boolean {
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
  return Math.abs(shoulderY - hipY) < 0.14;
}

export type PushupFsmState = AngleRepFsmState;

export const createPushupFsm = createAngleRepFsm;

export function updatePushupFsm(
  fsm: PushupFsmState,
  elbowAngleDeg: number,
  maxReps: number,
  opts?: Partial<typeof pushupRepThresholds>,
): void {
  updateAngleRepFsm(fsm, elbowAngleDeg, maxReps, {
    lowBelow: opts?.lowBelow ?? pushupRepThresholds.lowBelow,
    highAbove: opts?.highAbove ?? pushupRepThresholds.highAbove,
    frames: opts?.frames ?? pushupRepThresholds.frames,
  });
}
