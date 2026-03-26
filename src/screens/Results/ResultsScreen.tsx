import { AppText } from "@/components/AppText";
import { useAppSelector } from "@/store/hooks";
import type { RootState } from "@/store/store";
import type { FoodItemLog } from "@/utils/foodStorage";
import type { StepSession } from "@/utils/storage";
import moment from "moment";
import { useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export type ResultsCategory = "food" | "water" | "steps" | "fitness";

const CATEGORIES: { id: ResultsCategory; label: string }[] = [
  { id: "food", label: "Food track" },
  { id: "water", label: "Water track" },
  { id: "steps", label: "Step track" },
  { id: "fitness", label: "Fitness track" },
];

function totalFoodCalories(items: FoodItemLog[]): number {
  return Math.round(
    items.reduce((sum, item) => sum + item.calories * item.qty, 0),
  );
}

function buildDateKeys(start: string, end: string): string[] {
  const out: string[] = [];
  const cursor = moment(start, "YYYY-MM-DD");
  const endM = moment(end, "YYYY-MM-DD");
  while (cursor.isSameOrBefore(endM, "day")) {
    out.push(cursor.format("YYYY-MM-DD"));
    cursor.add(1, "day");
  }
  return out.reverse();
}

function buildRows(
  category: ResultsCategory,
  state: Pick<RootState, "food" | "water" | "dailyResults" | "stepSession">,
) {
  const start =
    state.dailyResults.usageStartDate ?? moment().format("YYYY-MM-DD");
  const today = moment().format("YYYY-MM-DD");
  const dates = buildDateKeys(start, today);

  return dates.map((date) => {
    let value = 0;
    let unit = "";

    switch (category) {
      case "food": {
        if (date === today) {
          value = totalFoodCalories(state.food.currentItems);
        } else {
          value =
            state.food.history.find((h) => h.date === date)?.totalCalories ?? 0;
        }
        unit = "kcal";
        break;
      }
      case "water": {
        if (date === today) {
          value = state.water.currentLiters;
        } else {
          value = state.water.history.find((h) => h.date === date)?.liters ?? 0;
        }
        unit = "L";
        break;
      }
      case "steps": {
        const stored = state.dailyResults.stepsByDate[date] ?? 0;
        const sess = state.stepSession as StepSession | null;
        if (date === today && sess) {
          value = Math.max(stored, sess.lastTotalSteps ?? 0);
        } else {
          value = stored;
        }
        unit = "steps";
        break;
      }
      case "fitness": {
        value = state.dailyResults.fitnessRepsByDate[date] ?? 0;
        unit = "reps";
        break;
      }
      default:
        break;
    }

    const label = moment(date, "YYYY-MM-DD").format("D MMMM YYYY");
    return { date, label, value, unit };
  });
}

export function ResultsScreen() {
  const [category, setCategory] = useState<ResultsCategory>("food");
  const food = useAppSelector((s) => s.food);
  const water = useAppSelector((s) => s.water);
  const dailyResults = useAppSelector((s) => s.dailyResults);
  const stepSession = useAppSelector((s) => s.stepSession);

  const rows = useMemo(
    () =>
      buildRows(category, {
        food,
        water,
        dailyResults,
        stepSession,
      }),
    [category, food, water, dailyResults, stepSession],
  );

  const usageStartDate = dailyResults.usageStartDate;

  const subtitle = useMemo(() => {
    if (!usageStartDate) {
      return "History starts after you confirm your profile. Days with no activity show as 0.";
    }
    return `From ${moment(usageStartDate, "YYYY-MM-DD").format("D MMM YYYY")} — days without activity show as 0.`;
  }, [usageStartDate]);

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.header}>
          <AppText variant="title" weight="bold" color="#F8FAFC">
            Results
          </AppText>
          <AppText size={13} color="#94A3B8" style={styles.subtitle}>
            {subtitle}
          </AppText>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsRow}
        >
          {CATEGORIES.map((c) => {
            const active = c.id === category;
            return (
              <Pressable
                key={c.id}
                onPress={() => setCategory(c.id)}
                style={[styles.tabChip, active && styles.tabChipActive]}
              >
                <AppText
                  size={13}
                  weight={active ? "bold" : "medium"}
                  color={active ? "#0F172A" : "#E2E8F0"}
                >
                  {c.label}
                </AppText>
              </Pressable>
            );
          })}
        </ScrollView>

        <FlatList
          data={rows}
          keyExtractor={(item) => item.date}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <AppText size={15} weight="semibold" color="#F1F5F9">
                  {item.label}
                </AppText>
                <AppText size={12} color="#64748B" style={{ marginTop: 2 }}>
                  {item.date}
                </AppText>
              </View>
              <View style={styles.valuePill}>
                <AppText size={16} weight="bold" color="#FACC15">
                  {category === "water"
                    ? Number(item.value.toFixed(1))
                    : item.value}
                </AppText>
                <AppText size={12} color="#CBD5E1" style={{ marginLeft: 4 }}>
                  {item.unit}
                </AppText>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#0a0618" },
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    // paddingBottom: 12,
  },
  subtitle: { marginTop: 8, lineHeight: 18 },
  tabsRow: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  tabChip: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "rgba(30,41,59,0.9)",
    borderWidth: 1,
    borderColor: "rgba(148,163,253,0.25)",
    marginRight: 8,
  },
  tabChipActive: {
    backgroundColor: "#A5B4FC",
    borderColor: "#818CF8",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 10,
    borderRadius: 16,
    backgroundColor: "rgba(15,23,42,0.72)",
    borderWidth: 1,
    borderColor: "rgba(148,163,253,0.2)",
  },
  valuePill: {
    flexDirection: "row",
    alignItems: "baseline",
    marginLeft: 12,
  },
});
