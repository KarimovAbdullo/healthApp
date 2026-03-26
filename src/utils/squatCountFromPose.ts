import { KnownPoseLandmarks as K } from "react-native-mediapipe";
import type { Landmark } from "react-native-mediapipe";
import {
  createAngleRepFsm,
  updateAngleRepFsm,
  type AngleRepFsmState,
} from "@/utils/angleRepFsm";
import { angleAtB, landmarkOk } from "@/utils/poseGeometry";

export const SQUAT_TARGET_REPS = 5;

export const squatRepThresholds = {
  lowBelow: 128,
  highAbove: 158,
  frames: 4,
} as const;

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

export type SquatFsmState = AngleRepFsmState;

export const createSquatFsm = createAngleRepFsm;

export function updateSquatFsm(
  fsm: SquatFsmState,
  kneeAngleDeg: number,
  maxReps: number,
  opts?: Partial<typeof squatRepThresholds>,
): void {
  updateAngleRepFsm(fsm, kneeAngleDeg, maxReps, {
    lowBelow: opts?.lowBelow ?? squatRepThresholds.lowBelow,
    highAbove: opts?.highAbove ?? squatRepThresholds.highAbove,
    frames: opts?.frames ?? squatRepThresholds.frames,
  });
}
