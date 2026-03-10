import { ReactNode } from "react";
import {
  Text as RNText,
  TextProps as RNTextProps,
  StyleProp,
  TextStyle,
} from "react-native";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

type AppTextVariant = "title" | "subtitle" | "body" | "caption";
type AppTextWeight = "regular" | "medium" | "semibold" | "bold" | "light";

export interface AppTextProps extends RNTextProps {
  children: ReactNode;
  variant?: AppTextVariant;
  weight?: AppTextWeight;
  size?: number;
  align?: TextStyle["textAlign"];
  color?: string;
  style?: StyleProp<TextStyle>;
}

const FONT_FAMILY: Record<AppTextWeight, string> = {
  regular: "Fredoka-Regular",
  medium: "Fredoka-Medium",
  semibold: "Fredoka-SemiBold",
  bold: "Fredoka-Bold",
  light: "Fredoka-Light",
};

const VARIANT_SIZE: Record<AppTextVariant, number> = {
  title: 24,
  subtitle: 18,
  body: 14,
  caption: 12,
};

export function AppText({
  children,
  variant = "body",
  weight = "regular",
  size,
  align,
  color,
  style,
  ...rest
}: AppTextProps) {
  const scheme = useColorScheme();
  const theme = Colors[scheme ?? "light"];

  const baseSize = size ?? VARIANT_SIZE[variant];

  return (
    <RNText
      {...rest}
      style={[
        {
          fontFamily: FONT_FAMILY[weight],
          fontSize: baseSize,
          textAlign: align,
          color: color ?? theme.text,
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
}

