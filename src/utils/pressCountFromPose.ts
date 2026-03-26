import { KnownPoseLandmarks as K } from "react-native-mediapipe";
import type { Landmark } from "react-native-mediapipe";
import {
  createAngleRepFsm,
  updateAngleRepFsm,
  type AngleRepFsmState,
} from "@/utils/angleRepFsm";
import { landmarkOk } from "@/utils/poseGeometry";
import { averageElbowAngleDeg } from "@/utils/pushupCountFromPose";

export const PRESS_TARGET_REPS = 10;

export const pressRepThresholds = {
  lowBelow: 100,
  highAbove: 158,
  frames: 4,
} as const;

/** Tik turish: sonlar ekranda yelkalardan aniq pastroq. */
export function isLikelyStandingPressPose(landmarks: Landmark[]): boolean {
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
  return hipY - shoulderY > 0.06;
}

export type PressFsmState = AngleRepFsmState;

export const createPressFsm = createAngleRepFsm;

export function updatePressFsm(
  fsm: PressFsmState,
  landmarks: Landmark[],
  maxReps: number,
  opts?: Partial<typeof pressRepThresholds>,
): void {
  const elbow = averageElbowAngleDeg(landmarks);
  if (elbow == null) return;
  updateAngleRepFsm(fsm, elbow, maxReps, {
    lowBelow: opts?.lowBelow ?? pressRepThresholds.lowBelow,
    highAbove: opts?.highAbove ?? pressRepThresholds.highAbove,
    frames: opts?.frames ?? pressRepThresholds.frames,
  });
}
