import ScrollIcon from "@/assets/icons/ScrollIcon";
import { AppText } from "@/components/AppText";
import {
  BodyCategory,
  getBmi,
  getBMR,
  getBodyCategory,
  getBodyFat,
  getExtraOrMissingWeight,
  getIdealWeightRange,
  getMacros,
  getTDEE,
  getWaterLiters,
} from "@/utils/bodyMetrics";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";
import { useRef, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import type { UserMetrics } from "../HomeScreen";

type InfoProps = {
  metrics: UserMetrics | null;
};

const categoryLabel: Record<BodyCategory, string> = {
  veryThin: "Very thin",
  normal: "Normal",
  overweight: "Overweight",
  obese: "Obese",
  veryObese: "Very obese",
};

const GOLD_COLORS: [string, string, string] = ["#FDE68A", "#FACC15", "#F97316"];

const styles = StyleSheet.create({
  container: {
    width: "60%",
    marginTop: 10,
    paddingRight: 6,
    zIndex: 3,
    position: "relative",
  },
  chipsWrapper: {
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 14,
    backgroundColor: "transparent",
    marginBottom: 6,
  },
  chipLabel: {
    marginRight: 6,
  },
  arrowBtn: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(17, 24, 39, 0.55)",
    borderRadius: 999,
    height: 28,
    width: 44,
    borderWidth: 1,
    borderColor: "rgba(148, 163, 253, 0.5)",
    zIndex: 10,
  },
  arrowDown: {
    bottom: -2,
    left: "50%",
    marginLeft: -22,
  },
  arrowUp: {
    top: -2,
    left: "50%",
    marginLeft: -22,
  },
});

const GradientNumber = ({ value }: { value: string }) => {
  return (
    <MaskedView
      maskElement={
        <AppText size={14} weight="medium" style={{ color: "black" }}>
          {value}
        </AppText>
      }
    >
      <LinearGradient
        colors={GOLD_COLORS}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <AppText size={14} weight="medium" style={{ opacity: 0 }}>
          {value}
        </AppText>
      </LinearGradient>
    </MaskedView>
  );
};

const Info = ({ metrics }: InfoProps) => {
  const scrollRef = useRef<ScrollView>(null);
  const SCROLL_VIEW_HEIGHT = 220;

  const [contentHeight, setContentHeight] = useState(0);
  const [visibleHeight, setVisibleHeight] = useState(SCROLL_VIEW_HEIGHT);
  const [scrollY, setScrollY] = useState(0);

  const maxScrollY = Math.max(0, contentHeight - visibleHeight);
  const isAtTop = scrollY <= 0.5;
  const isAtBottom = scrollY >= maxScrollY - 0.5;

  const SCROLL_STEP = 180;

  const scrollToY = (nextY: number) => {
    const clamped = Math.min(maxScrollY, Math.max(0, nextY));
    scrollRef.current?.scrollTo({ y: clamped, animated: true });
  };

  const handleArrowDown = () => {
    if (isAtBottom) return;
    scrollToY(scrollY + SCROLL_STEP);
  };

  const handleArrowUp = () => {
    if (isAtTop) return;
    scrollToY(scrollY - SCROLL_STEP);
  };

  if (!metrics) {
    return null;
  }

  const bmi = getBmi(metrics.weightKg, metrics.heightCm);
  const roundedBmi = bmi ? Number(bmi.toFixed(1)) : 0;
  const category = getBodyCategory(metrics.weightKg, metrics.heightCm);
  const { min, max } = getIdealWeightRange(metrics.heightCm);
  const extra = getExtraOrMissingWeight(metrics.weightKg, metrics.heightCm);

  const extraLabel =
    extra.type === "none"
      ? "—"
      : extra.type === "extra"
        ? `+${extra.amount} kg`
        : `-${extra.amount} kg`;

  const bodyFatPct = getBodyFat(bmi, metrics.age, metrics.gender);
  const bodyFatRounded = Math.round(bodyFatPct * 10) / 10;
  const bmr = Math.round(
    getBMR(metrics.weightKg, metrics.heightCm, metrics.age, metrics.gender),
  );
  const tdee = Math.round(getTDEE(bmr, metrics.activityLevel));
  const weightLossCal = tdee - 500;
  const waterL = getWaterLiters(metrics.weightKg);
  const waterRounded = Math.round(waterL * 10) / 10;
  const macros = getMacros(tdee);

  return (
    <View style={styles.container} pointerEvents="box-none">
      <ScrollView
        ref={scrollRef}
        style={{ maxHeight: SCROLL_VIEW_HEIGHT }}
        contentContainerStyle={styles.chipsWrapper}
        showsVerticalScrollIndicator={false}
        bounces
        nestedScrollEnabled
        onContentSizeChange={(_, h) => setContentHeight(h)}
        onLayout={(e) => setVisibleHeight(e.nativeEvent.layout.height)}
        onScroll={(e) => setScrollY(e.nativeEvent.contentOffset.y)}
        scrollEventThrottle={16}
      >
        <AppText
          size={12}
          weight="semibold"
          color="#9CA3AF"
          style={styles.sectionTitle}
        >
          Body
        </AppText>

        <View style={styles.chip}>
          <AppText
            size={14}
            weight="light"
            color="white"
            style={styles.chipLabel}
          >
            Category:
          </AppText>
          <GradientNumber value={categoryLabel[category]} />
        </View>

        <View style={styles.chip}>
          <AppText
            size={14}
            weight="light"
            color="white"
            style={styles.chipLabel}
          >
            BMI:
          </AppText>
          <GradientNumber value={String(roundedBmi)} />
        </View>

        <View style={styles.chip}>
          <AppText
            size={14}
            weight="light"
            color="white"
            style={styles.chipLabel}
          >
            Body fat:
          </AppText>
          <GradientNumber value={`${bodyFatRounded} %`} />
        </View>

        <View style={styles.chip}>
          <AppText
            size={14}
            weight="light"
            color="white"
            style={styles.chipLabel}
          >
            Ideal weight:
          </AppText>
          <GradientNumber value={`${min} – ${max} kg`} />
        </View>

        <View style={styles.chip}>
          <AppText
            size={14}
            weight="light"
            color="white"
            style={styles.chipLabel}
          >
            Extra / missing:
          </AppText>
          <GradientNumber value={extraLabel} />
        </View>

        <AppText
          size={12}
          weight="semibold"
          color="#9CA3AF"
          style={styles.sectionTitle}
        >
          Calories & health
        </AppText>

        <View style={styles.chip}>
          <AppText
            size={14}
            weight="light"
            color="white"
            style={styles.chipLabel}
          >
            BMR:
          </AppText>
          <GradientNumber value={`${bmr} kcal/day`} />
        </View>

        <View style={styles.chip}>
          <AppText
            size={14}
            weight="light"
            color="white"
            style={styles.chipLabel}
          >
            Daily calories:
          </AppText>
          <GradientNumber value={`${tdee} kcal`} />
        </View>

        <View style={styles.chip}>
          <AppText
            size={14}
            weight="light"
            color="white"
            style={styles.chipLabel}
          >
            For weight loss:
          </AppText>
          <GradientNumber value={`${weightLossCal} kcal/day`} />
        </View>

        <View style={styles.chip}>
          <AppText
            size={14}
            weight="light"
            color="white"
            style={styles.chipLabel}
          >
            Water:
          </AppText>
          <GradientNumber value={`${waterRounded} L/day`} />
        </View>

        <View style={styles.chip}>
          <AppText
            size={14}
            weight="light"
            color="white"
            style={styles.chipLabel}
          >
            Protein:
          </AppText>
          <GradientNumber value={`${macros.proteinGrams} g`} />
        </View>

        <View style={styles.chip}>
          <AppText
            size={14}
            weight="light"
            color="white"
            style={styles.chipLabel}
          >
            Carbs:
          </AppText>
          <GradientNumber value={`${macros.carbGrams} g`} />
        </View>

        <View style={styles.chip}>
          <AppText
            size={14}
            weight="light"
            color="white"
            style={styles.chipLabel}
          >
            Fat:
          </AppText>
          <GradientNumber value={`${macros.fatGrams} g`} />
        </View>
      </ScrollView>

      {!isAtTop && (
        <TouchableOpacity
          style={[styles.arrowBtn, styles.arrowUp]}
          onPress={handleArrowUp}
          activeOpacity={0.8}
        >
          <AppText size={16} weight="bold" color="#F9FAFB">
            ^
          </AppText>
        </TouchableOpacity>
      )}

      {!isAtBottom && (
        <TouchableOpacity
          style={[styles.arrowBtn, styles.arrowDown]}
          onPress={handleArrowDown}
          activeOpacity={0.8}
        >
          <ScrollIcon />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Info;
