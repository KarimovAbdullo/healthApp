import { AppText } from "@/components/AppText";
import React from "react";
import { Image, ImageSourcePropType, TouchableOpacity, View } from "react-native";

import { styles } from "../WaterScreen.styles";

const glassImg: ImageSourcePropType = require("@/assets/images/stakan.png");

export type GlassOption = {
  id: string;
  label: string;
  liters: number;
};

export function WaterGlassPicker({
  options,
  onSelect,
}: {
  options: GlassOption[];
  onSelect: (liters: number) => void;
}) {
  return (
    <View style={styles.row}>
      {options.map((opt) => (
        <TouchableOpacity
          key={opt.id}
          style={styles.glassOption}
          onPress={() => onSelect(opt.liters)}
          activeOpacity={0.8}
        >
          <Image source={glassImg} style={styles.glassImage} />
          <AppText
            size={14}
            weight="medium"
            color="#E5E7EB"
            style={{ marginTop: 4 }}
          >
            {opt.label}
          </AppText>
        </TouchableOpacity>
      ))}
    </View>
  );
}

