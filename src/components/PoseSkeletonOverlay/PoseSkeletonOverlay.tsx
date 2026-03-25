import { StyleSheet } from "react-native";
import Svg, { Line } from "react-native-svg";

export type PoseSkeleton = {
  lines: { x1: number; y1: number; x2: number; y2: number }[];
};

type PoseSkeletonOverlayProps = {
  width: number;
  height: number;
  skeleton: PoseSkeleton | null;
};

export function PoseSkeletonOverlay({
  width,
  height,
  skeleton,
}: PoseSkeletonOverlayProps) {
  if (!skeleton?.lines.length || width <= 0 || height <= 0) {
    return null;
  }

  return (
    <Svg
      width={width}
      height={height}
      style={StyleSheet.absoluteFill}
      pointerEvents="none"
    >
      {skeleton.lines.map((l, i) => (
        <Line
          key={`seg-${i}`}
          x1={l.x1}
          y1={l.y1}
          x2={l.x2}
          y2={l.y2}
          stroke="rgba(250, 204, 21, 0.55)"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      ))}
    </Svg>
  );
}
