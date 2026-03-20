import { AppText } from "@/components/AppText";
import React from "react";
import { View } from "react-native";
import moment from "moment";

import type { FoodHistoryItem } from "@/utils/foodStorage";
import { styles } from "../FoodScreen.styles";

export function FoodHistorySection({
  history,
  onLayoutY,
}: {
  history: FoodHistoryItem[];
  onLayoutY: (y: number) => void;
}) {
  return (
    <View
      onLayout={(e) => onLayoutY(e.nativeEvent.layout.y)}
      style={styles.historySectionWrap}
    >
      <View style={styles.historySection}>
        {history.length === 0 ? (
          <AppText size={12} color="#CBD5E1">
            No previous food history yet.
          </AppText>
        ) : (
          history
            .slice()
            .reverse()
            .map((day) => (
              <View key={day.date} style={styles.historyCard}>
                <AppText size={13} weight="semibold" color="#E5E7EB">
                  {moment(day.date, "YYYY-MM-DD").format("DD/MM/YYYY")}
                </AppText>
                <AppText size={12} color="#CBD5E1" style={{ marginTop: 2 }}>
                  Total: {Math.round(day.totalCalories)} kcal
                </AppText>
                <AppText size={12} color="#9CA3AF" style={{ marginTop: 8 }}>
                  Foods:
                </AppText>
                {day.items.map((item) => (
                  <AppText key={`${day.date}-${item.id}`} size={12} color="#E2E8F0">
                    - {item.name} ({item.qty}x {item.unit})
                  </AppText>
                ))}
              </View>
            ))
        )}
      </View>
    </View>
  );
}

