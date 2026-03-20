import { AppText } from "@/components/AppText";
import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

import { styles } from "../FoodScreen.styles";

export function FoodManualForm({
  name,
  calories,
  onChangeName,
  onChangeCalories,
  onAdd,
}: {
  name: string;
  calories: string;
  onChangeName: (v: string) => void;
  onChangeCalories: (v: string) => void;
  onAdd: () => void;
}) {
  return (
    <View style={styles.manualWrap}>
      <AppText size={16} weight="semibold" color="#F9FAFB">
        Food name
      </AppText>
      <TextInput
        value={name}
        onChangeText={onChangeName}
        placeholder="Enter product name"
        placeholderTextColor="rgba(229,231,235,0.65)"
        style={styles.manualInput}
      />

      <AppText size={16} weight="semibold" color="#F9FAFB" style={{ marginTop: 14 }}>
        Calories
      </AppText>
      <TextInput
        value={calories}
        onChangeText={onChangeCalories}
        placeholder="Enter kcal"
        placeholderTextColor="rgba(229,231,235,0.65)"
        keyboardType="numeric"
        style={styles.manualInput}
      />

      <TouchableOpacity activeOpacity={0.85} style={styles.addManualBtn} onPress={onAdd}>
        <AppText size={18} weight="bold" color="#F9FAFB">
          Add Food
        </AppText>
      </TouchableOpacity>
    </View>
  );
}

