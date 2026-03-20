import { AppText } from "@/components/AppText";
import React from "react";
import { TouchableOpacity, View } from "react-native";

import { styles } from "../FoodScreen.styles";

export function FoodBottomBar({
  totalKcal,
  onAddFoodPress,
  children,
}: {
  totalKcal: number;
  onAddFoodPress: () => void;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.bottomArea} pointerEvents="box-none">
      <AppText size={34} weight="bold" color="#F9FAFB">
        {totalKcal.toFixed(0)} kcal
      </AppText>

      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.addBtn}
        onPress={onAddFoodPress}
      >
        <AppText size={18} weight="semibold" color="#F9FAFB">
          Add Food
        </AppText>
      </TouchableOpacity>

      {children}
    </View>
  );
}

