import { AppText } from "@/components/AppText";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import React from "react";
import { TouchableOpacity, View } from "react-native";

import { styles } from "../FoodScreen.styles";
import { formatUnit } from "../foodUtils";
import type { SelectedFood } from "../FoodScreenTypes";

export function FoodSelectedFoodsList({
  selectedFoods,
  onInc,
  onDec,
  onDelete,
}: {
  selectedFoods: SelectedFood[];
  onInc: (id: string) => void;
  onDec: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <View style={styles.selectedFoodsWrap}>
      {selectedFoods.map((item) => {
        const perServing = `${item.item.calories} kcal / ${formatUnit(item.item.unit)}`;
        const itemTotal = item.item.calories * item.qty;

        return (
          <View key={item.id} style={styles.rowCard}>
            <View style={styles.rowLeft}>
              <AppText
                size={14}
                weight="semibold"
                color="#F9FAFB"
                style={styles.rowName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.item.name}
              </AppText>
              <AppText size={11} color="rgba(229,231,235,0.85)" style={styles.rowTextCol}>
                {perServing}
              </AppText>
            </View>

            <View style={styles.selectedRightRow}>
              <View style={styles.stepper}>
                <TouchableOpacity
                  onPress={() => onDec(item.id)}
                  activeOpacity={0.75}
                  style={styles.stepBtn}
                >
                  <AppText size={16} weight="bold" color="#E5E7EB">
                    −
                  </AppText>
                </TouchableOpacity>

                <View style={styles.stepBox}>
                  <AppText size={12} weight="semibold" color="#0F172A">
                    {item.qty}x
                  </AppText>
                </View>

                <TouchableOpacity
                  onPress={() => onInc(item.id)}
                  activeOpacity={0.75}
                  style={styles.stepBtn}
                >
                  <AppText size={16} weight="bold" color="#F9FAFB">
                    +
                  </AppText>
                </TouchableOpacity>
              </View>

              <AppText size={13} weight="semibold" color="#F9FAFB" style={styles.rowTotalKcal}>
                {itemTotal.toFixed(0)} kcal
              </AppText>

              <TouchableOpacity
                onPress={() => onDelete(item.id)}
                activeOpacity={0.7}
                style={styles.rowDeleteBtn}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                accessibilityRole="button"
                accessibilityLabel="Remove food"
              >
                <MaterialIcons name="delete-outline" size={20} color="#FCA5A5" />
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
}
