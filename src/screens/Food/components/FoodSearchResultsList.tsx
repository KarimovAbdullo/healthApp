import { AppText } from "@/components/AppText";
import React from "react";
import {
  FlatList,
  Image,
  ImageSourcePropType,
  TouchableOpacity,
  View,
} from "react-native";

import { styles } from "../FoodScreen.styles";

import type { FoodEntry } from "../FoodScreenTypes";
import { formatUnit } from "../foodUtils";

const foodIcon: ImageSourcePropType = require("@/assets/images/food.webp");

export type FilteredFood = {
  item: FoodEntry;
  originalIndex: number;
};

export function FoodSearchResultsList({
  results,
  onAdd,
}: {
  results: FilteredFood[];
  onAdd: (originalIndex: number) => void;
}) {
  return (
    <FlatList
      data={results}
      keyExtractor={(it) => String(it.originalIndex)}
      renderItem={({ item }) => (
        <View style={styles.rowCard}>
          <View style={styles.rowLeft}>
            <Image source={foodIcon} style={styles.foodImg} resizeMode="contain" />
            <View style={styles.rowTextCol}>
              <AppText size={18} weight="semibold" color="#F9FAFB">
                {item.item.name}
              </AppText>
              <AppText size={13} color="rgba(229,231,235,0.9)">
                {item.item.calories} kcal / {formatUnit(item.item.unit)}
              </AppText>
            </View>
          </View>

          <TouchableOpacity
            activeOpacity={0.85}
            style={styles.addMiniBtn}
            onPress={() => onAdd(item.originalIndex)}
          >
            <AppText size={14} weight="bold" color="#F9FAFB">
              Add
            </AppText>
          </TouchableOpacity>
        </View>
      )}
      style={{ marginTop: 10 }}
      contentContainerStyle={{ paddingBottom: 140, gap: 12 }}
      showsVerticalScrollIndicator={false}
    />
  );
}

