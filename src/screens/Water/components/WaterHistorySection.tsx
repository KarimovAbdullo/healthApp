import { AppText } from "@/components/AppText";
import React from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import moment from "moment";
import { useTranslation } from "react-i18next";

import type { WaterHistoryItem } from "@/utils/waterStorage";
import { styles } from "../WaterScreen.styles";

export function WaterHistorySection({
  todayLiters,
  history,
  onHistoryScroll,
}: {
  todayLiters: number;
  history: WaterHistoryItem[];
  onHistoryScroll: () => void;
}) {
  const { t } = useTranslation();
  return (
    <View>
      <TouchableOpacity
        style={styles.historyButton}
        activeOpacity={0.8}
        onPress={onHistoryScroll}
      >
        <AppText size={13} weight="semibold" color="white">
          {t("water.historyDaily")}
        </AppText>
      </TouchableOpacity>

      <View style={styles.historySection}>
        <AppText
          size={12}
          weight="semibold"
          color="#9CA3AF"
          style={{ marginBottom: 8 }}
        >
          {t("water.today")}: {todayLiters.toFixed(1)} L
        </AppText>

        <AppText
          size={12}
          weight="semibold"
          color="#9CA3AF"
          style={{ marginBottom: 8 }}
        >
          {t("water.previousDays")}
        </AppText>

        {history.length === 0 ? (
          <AppText size={12} color="#6B7280">
            {t("water.noHistory")}
          </AppText>
        ) : (
          history
            .slice()
            .reverse()
            .map((item) => {
              const date = moment(item.date, "YYYY-MM-DD");
              return (
                <View key={item.date} style={styles.historyCard}>
                  <AppText size={12} weight="semibold" color="#E5E7EB">
                    {date.format("ddd")}
                  </AppText>
                  <AppText size={11} color="#9CA3AF">
                    {date.format("DD/MM/YYYY")}
                  </AppText>
                  <AppText
                    size={14}
                    weight="bold"
                    color="#38BDF8"
                    style={{ marginTop: 4 }}
                  >
                    {item.liters.toFixed(1)} L
                  </AppText>
                </View>
              );
            })
        )}
      </View>
    </View>
  );
}

// Keep ScrollView import for potential future extension.
void ScrollView;

