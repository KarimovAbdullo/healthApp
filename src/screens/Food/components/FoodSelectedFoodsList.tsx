import { AppText } from "@/components/AppText";
import React from "react";
import { Image, ImageSourcePropType, TouchableOpacity, View } from "react-native";

import { styles } from "../FoodScreen.styles";
import { formatUnit } from "../foodUtils";
import type { SelectedFood } from "../FoodScreenTypes";

const foodIcon: ImageSourcePropType = require("@/assets/images/food.webp");

export function FoodSelectedFoodsList({
  selectedFoods,
  onInc,
  onDec,
}: {
  selectedFoods: SelectedFood[];
  onInc: (id: string) => void;
  onDec: (id: string) => void;
}) {
  return (
    <View style={styles.selectedFoodsWrap}>
      {selectedFoods.map((item) => {
        const subtitle = `${item.item.calories} kcal / ${formatUnit(item.item.unit)}`;
        const itemTotal = item.item.calories * item.qty;

        return (
          <View key={item.id} style={styles.rowCard}>
            <View style={styles.rowLeft}>
              <Image
                source={foodIcon}
                style={styles.foodImg}
                resizeMode="contain"
              />
              <View style={styles.rowTextCol}>
                <AppText size={18} weight="semibold" color="#F9FAFB">
                  {item.item.name}
                </AppText>
                <AppText size={13} color="rgba(229,231,235,0.9)">
                  {subtitle}
                </AppText>
              </View>
            </View>

            <View style={styles.selectedRightCol}>
              <AppText
                size={14}
                weight="semibold"
                color="#F9FAFB"
                style={{ marginBottom: 8 }}
              >
                {itemTotal.toFixed(0)} kcal
              </AppText>

              <View style={styles.stepper}>
                <TouchableOpacity
                  onPress={() => onDec(item.id)}
                  activeOpacity={0.75}
                  style={styles.stepBtn}
                >
                  <AppText size={18} weight="bold" color="#E5E7EB">
                    −
                  </AppText>
                </TouchableOpacity>

                <View style={styles.stepBox}>
                  <AppText size={15} weight="semibold" color="#0F172A">
                    {item.qty}x {item.item.unit}
                  </AppText>
                </View>

                <TouchableOpacity
                  onPress={() => onInc(item.id)}
                  activeOpacity={0.75}
                  style={styles.stepBtn}
                >
                  <AppText size={18} weight="bold" color="#F9FAFB">
                    +
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}

