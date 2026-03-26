import type { PoseSkeleton } from "@/components/PoseSkeletonOverlay/PoseSkeletonOverlay";
import {
  KnownPoseLandmarkConnections,
  type PoseDetectionResultBundle,
  type ViewCoordinator,
} from "react-native-mediapipe";

function isLandmarkUsable(lm: {
  visibility?: number;
  presence?: number;
}): boolean {
  if (lm.visibility != null && lm.visibility < 0.45) return false;
  if (lm.presence != null && lm.presence < 0.45) return false;
  return true;
}

export function buildPoseSkeletonLines(
  bundle: PoseDetectionResultBundle,
  vc: ViewCoordinator,
): PoseSkeleton | null {
  const poseLandmarks = bundle.results[0]?.landmarks?.[0];
  if (!poseLandmarks?.length) return null;

  const frameDims = vc.getFrameDims(bundle);
  const jointsScreen = poseLandmarks.map((lm) => {
    if (!isLandmarkUsable(lm)) return null;
    return vc.convertPoint(frameDims, { x: lm.x, y: lm.y });
  });

  const lines: PoseSkeleton["lines"] = [];
  for (const [a, b] of KnownPoseLandmarkConnections) {
    const p1 = jointsScreen[a];
    const p2 = jointsScreen[b];
    if (!p1 || !p2) continue;
    lines.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y });
  }

  return { lines };
}
