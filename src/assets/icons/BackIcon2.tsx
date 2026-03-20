import React from "react";
import Svg, { Path } from "react-native-svg";

interface BackIcon2Props {
  size?: number;
  color?: string;
}

const BackIcon2: React.FC<BackIcon2Props> = ({
  size = 24,
  color = "#FFFFFF",
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 7L10 12L15 17"
      stroke={color}
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default BackIcon2;
