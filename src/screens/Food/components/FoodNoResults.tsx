import { AppText } from "@/components/AppText";
import React from "react";
import { TouchableOpacity, View } from "react-native";

import { styles } from "../FoodScreen.styles";

export function FoodNoResults({ onAddManually }: { onAddManually: () => void }) {
  return (
    <View style={styles.noResultsWrap}>
      <AppText size={38} weight="bold" color="#F9FAFB">
        No results found
      </AppText>
      <AppText size={20} weight="semibold" color="#E5E7EB" style={{ marginTop: 14 }}>
        Can&apos;t find your product?
      </AppText>
      <AppText size={14} color="rgba(229,231,235,0.85)" style={{ marginTop: 8 }}>
        Add it manually with calories
      </AppText>

      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.addManualBtn}
        onPress={onAddManually}
      >
        <AppText size={18} weight="bold" color="#F9FAFB">
          Add manually
        </AppText>
      </TouchableOpacity>
    </View>
  );
}

