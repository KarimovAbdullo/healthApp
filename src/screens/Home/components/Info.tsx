import { AppText } from "@/components/AppText";
import { GlassTabBar } from "@/components/GlowButton";
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
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
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
});

const GradientNumber = ({
  value,
}: {
  value: string;
}) => {
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
  const [contentHeight, setContentHeight] = useState(0);
  const scrollY = useRef(0);
  const isAtBottom = useRef(false);
  const [isPaused, setIsPaused] = useState(false);
  const pauseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const SCROLL_STEP = 1;
  const SCROLL_INTERVAL_MS = 80;
  const SCROLL_PAUSE_AT_END_MS = 1500;
  const SCROLL_VIEW_HEIGHT = 220;

  useEffect(() => {
    if (contentHeight <= SCROLL_VIEW_HEIGHT) return;
    if (isPaused) return;

    const scroll = () => {
      if (isAtBottom.current) return;

      scrollY.current += SCROLL_STEP;
      const maxScroll = contentHeight - SCROLL_VIEW_HEIGHT;

      if (scrollY.current >= maxScroll) {
        scrollY.current = maxScroll;
        isAtBottom.current = true;
        scrollRef.current?.scrollTo({ y: scrollY.current, animated: true });

        pauseTimeout.current = setTimeout(() => {
          isAtBottom.current = false;
          scrollY.current = 0;
          scrollRef.current?.scrollTo({ y: 0, animated: true });
        }, SCROLL_PAUSE_AT_END_MS);
      } else {
        scrollRef.current?.scrollTo({ y: scrollY.current, animated: false });
      }
    };

    const interval = setInterval(scroll, SCROLL_INTERVAL_MS);
    return () => {
      clearInterval(interval);
      if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
    };
  }, [contentHeight, isPaused]);

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
    <View style={styles.container}>
      <GlassTabBar style={{ borderRadius: 20, backgroundColor: "transparent" }}>
        <ScrollView
          ref={scrollRef}
          style={{ maxHeight: SCROLL_VIEW_HEIGHT }}
          contentContainerStyle={styles.chipsWrapper}
          showsVerticalScrollIndicator={false}
          bounces
          onScrollBeginDrag={() => setIsPaused(true)}
          onContentSizeChange={(_, h) => setContentHeight(h)}
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
            <GradientNumber
              value={`${bodyFatRounded} %`}
            />
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
            <GradientNumber
              value={`${min} – ${max} kg`}
            />
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
      </GlassTabBar>
    </View>
  );
};

export default Info;
