import { AppText } from "@/components/AppText";
import React from "react";
import { TouchableOpacity, View } from "react-native";

import { styles } from "../WaterScreen.styles";

export function WaterHeader({ onBackPress }: { onBackPress: () => void }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <AppText size={18} color="#E5E7EB">
          ←
        </AppText>
      </TouchableOpacity>

      <AppText variant="title" weight="bold" color="#F9FAFB">
        Log Water
      </AppText>
    </View>
  );
}

