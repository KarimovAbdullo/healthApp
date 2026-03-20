import { AppText } from "@/components/AppText";
import React from "react";
import { TouchableOpacity } from "react-native";

import { styles } from "../WaterScreen.styles";

export function WaterActionButtons({
  totalSelected,
  onConfirm,
  onClear,
}: {
  totalSelected: number;
  onConfirm: () => void;
  onClear: () => void;
}) {
  return (
    <>
      <TouchableOpacity
        activeOpacity={0.85}
        style={[
          styles.addButton,
          totalSelected === 0 && { opacity: 0.4 },
        ]}
        onPress={onConfirm}
        disabled={totalSelected === 0}
      >
        <AppText weight="bold" color="#0F172A">
          Add Water
        </AppText>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.clearButton}
        onPress={onClear}
        activeOpacity={0.8}
      >
        <AppText size={13} weight="medium" color="#E5E7EB">
          Clear
        </AppText>
      </TouchableOpacity>
    </>
  );
}

