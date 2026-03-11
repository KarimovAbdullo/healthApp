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

const SCROLL_STEP = 1;
const SCROLL_INTERVAL_MS = 80;
const SCROLL_PAUSE_AT_END_MS = 1500;

type InfoProps = {
  metrics: UserMetrics | null;
  isExpanded?: boolean;
};

const categoryLabel: Record<BodyCategory, string> = {
  veryThin: "Very thin",
  normal: "Normal",
  overweight: "Overweight",
  obese: "Obese",
  veryObese: "Very obese",
};

const getGradientColorsByCategory = (
  category: BodyCategory,
): [string, string] => {
  if (category === "veryThin") {
    return ["#FACC15", "#FBBF24"];
  }
  if (category === "normal") {
    return ["#22C55E", "#4ADE80"];
  }
  if (category === "overweight") {
    return ["#FACC15", "#FBBF24"];
  }
  if (category === "obese") {
    return ["#FB7185", "#F97316"];
  }
  return ["#EF4444", "#DC2626"];
};

const infoStyles = StyleSheet.create({
  rowBorder: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "rgba(238, 230, 230, 0.79)",
  },
  rowLast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    width: "100%",
    justifyContent: "space-between",
  },
  label: {
    flex: 1,
    flexShrink: 1,
  },
  value: {
    flexShrink: 0,
  },
  scroll: {
    maxHeight: 220,
  },
  scrollContent: {
    paddingBottom: 16,
    paddingHorizontal: 12,
  },
});

const GradientNumber = ({
  value,
  category,
}: {
  value: string;
  category: BodyCategory;
}) => {
  const colors = getGradientColorsByCategory(category);

  return (
    <MaskedView
      maskElement={
        <AppText size={14} weight="medium" style={{ color: "black" }}>
          {value}
        </AppText>
      }
    >
      <LinearGradient
        colors={colors}
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

const Info = ({ metrics, isExpanded = true }: InfoProps) => {
  const scrollRef = useRef<ScrollView>(null);
  const scrollY = useRef(0);
  const contentHeight = useRef(0);
  const [contentHeightState, setContentHeightState] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollViewHeight = 220;
  const isAtBottom = useRef(false);
  const pauseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isExpanded) {
      setIsPaused(false);
      scrollY.current = 0;
      isAtBottom.current = false;
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }
  }, [isExpanded]);

  useEffect(() => {
    if (contentHeightState <= scrollViewHeight) return;
    if (isPaused) return;

    const scroll = () => {
      if (isAtBottom.current) return;

      scrollY.current += SCROLL_STEP;
      const maxScroll = contentHeight.current - scrollViewHeight;

      if (scrollY.current >= maxScroll) {
        scrollY.current = maxScroll;
        isAtBottom.current = true;
        scrollRef.current?.scrollTo({
          y: scrollY.current,
          animated: true,
        });
        pauseTimeout.current = setTimeout(() => {
          isAtBottom.current = false;
          scrollY.current = 0;
          scrollRef.current?.scrollTo({
            y: 0,
            animated: true,
          });
        }, SCROLL_PAUSE_AT_END_MS);
      } else {
        scrollRef.current?.scrollTo({
          y: scrollY.current,
          animated: false,
        });
      }
    };

    const interval = setInterval(scroll, SCROLL_INTERVAL_MS);
    return () => {
      clearInterval(interval);
      if (pauseTimeout.current) clearTimeout(pauseTimeout.current);
    };
  }, [metrics, contentHeightState, isPaused]);

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

  const bmr = Math.round(
    getBMR(metrics.weightKg, metrics.heightCm, metrics.age, metrics.gender),
  );
  const tdee = Math.round(getTDEE(bmr, metrics.activityLevel));
  const weightLossCal = tdee - 500;
  const bodyFatPct = getBodyFat(bmi, metrics.age, metrics.gender);
  const bodyFatRounded = Math.round(bodyFatPct * 10) / 10;
  const waterL = getWaterLiters(metrics.weightKg);
  const waterRounded = Math.round(waterL * 10) / 10;
  const macros = getMacros(tdee);

  return (
    <View
      style={{
        width: "78%",
        marginTop: 10,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        paddingRight: 4,
        zIndex: 3,
      }}
    >
      <GlassTabBar
        style={{
          borderRadius: 20,
          shadowColor: "white",
          backgroundColor: "transparent",
        }}
      >
        <ScrollView
          ref={scrollRef}
          style={infoStyles.scroll}
          contentContainerStyle={infoStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
          onScrollBeginDrag={() => setIsPaused(true)}
          onContentSizeChange={(_, h) => {
            contentHeight.current = h;
            setContentHeightState(h);
          }}
        >
          <View style={{ paddingVertical: 4 }}>
            <AppText
              size={12}
              weight="semibold"
              color="#9CA3AF"
              style={{ marginBottom: 8 }}
            >
              Body
            </AppText>
            <View style={infoStyles.rowBorder}>
              <View style={infoStyles.label}>
                <AppText size={14} weight="light">
                  Category
                </AppText>
              </View>
              <View style={infoStyles.value}>
                <AppText size={14} weight="medium">
                  {categoryLabel[category]}
                </AppText>
              </View>
            </View>
            <View style={infoStyles.rowBorder}>
              <View style={infoStyles.label}>
                <AppText size={14} weight="light">
                  BMI
                </AppText>
              </View>
              <View style={infoStyles.value}>
                <GradientNumber
                  value={String(roundedBmi)}
                  category={category}
                />
              </View>
            </View>
            <View style={infoStyles.rowLast}>
              <View style={infoStyles.label}>
                <AppText size={14} weight="light">
                  Body fat
                </AppText>
              </View>
              <View style={infoStyles.value}>
                <GradientNumber
                  value={`${bodyFatRounded} %`}
                  category={category}
                />
              </View>
            </View>

            <AppText
              size={12}
              weight="semibold"
              color="#9CA3AF"
              style={{ marginTop: 12, marginBottom: 8 }}
            >
              Weight
            </AppText>
            <View style={infoStyles.rowBorder}>
              <View style={infoStyles.label}>
                <AppText size={14} weight="light">
                  Ideal weight range
                </AppText>
              </View>
              <View style={infoStyles.value}>
                <GradientNumber
                  value={`${min} – ${max} kg`}
                  category={category}
                />
              </View>
            </View>
            <View style={infoStyles.rowLast}>
              <View style={infoStyles.label}>
                <AppText size={14} weight="light">
                  Extra / missing weight
                </AppText>
              </View>
              <View style={infoStyles.value}>
                <GradientNumber value={extraLabel} category={category} />
              </View>
            </View>

            <AppText
              size={12}
              weight="semibold"
              color="#9CA3AF"
              style={{ marginTop: 12, marginBottom: 8 }}
            >
              Calories
            </AppText>
            <View style={infoStyles.rowBorder}>
              <View style={infoStyles.label}>
                <AppText size={14} weight="light">
                  BMR
                </AppText>
              </View>
              <View style={infoStyles.value}>
                <GradientNumber value={`${bmr} kcal/day`} category={category} />
              </View>
            </View>
            <View style={infoStyles.rowBorder}>
              <View style={infoStyles.label}>
                <AppText size={14} weight="light">
                  Daily calories
                </AppText>
              </View>
              <View style={infoStyles.value}>
                <GradientNumber value={`${tdee} kcal`} category={category} />
              </View>
            </View>
            <View style={infoStyles.rowBorder}>
              <View style={infoStyles.label}>
                <AppText size={14} weight="light">
                  Calories for weight loss
                </AppText>
              </View>
              <View style={infoStyles.value}>
                <GradientNumber
                  value={`${weightLossCal} kcal/day`}
                  category={category}
                />
              </View>
            </View>
            <View style={infoStyles.rowLast}>
              <View style={infoStyles.label}>
                <AppText size={12} weight="light" color="#9CA3AF">
                  Expected loss ≈ 0.5 kg per week
                </AppText>
              </View>
            </View>

            <AppText
              size={12}
              weight="semibold"
              color="#9CA3AF"
              style={{ marginTop: 12, marginBottom: 8 }}
            >
              Health
            </AppText>
            <View style={infoStyles.rowBorder}>
              <View style={infoStyles.label}>
                <AppText size={14} weight="light">
                  Recommended water
                </AppText>
              </View>
              <View style={infoStyles.value}>
                <GradientNumber
                  value={`${waterRounded} L/day`}
                  category={category}
                />
              </View>
            </View>
            <View style={infoStyles.rowBorder}>
              <View style={infoStyles.label}>
                <AppText size={14} weight="light">
                  Protein
                </AppText>
              </View>
              <View style={infoStyles.value}>
                <GradientNumber
                  value={`${macros.proteinGrams} g`}
                  category={category}
                />
              </View>
            </View>
            <View style={infoStyles.rowBorder}>
              <View style={infoStyles.label}>
                <AppText size={14} weight="light">
                  Carbs
                </AppText>
              </View>
              <View style={infoStyles.value}>
                <GradientNumber
                  value={`${macros.carbGrams} g`}
                  category={category}
                />
              </View>
            </View>
            <View style={infoStyles.rowLast}>
              <View style={infoStyles.label}>
                <AppText size={14} weight="light">
                  Fat
                </AppText>
              </View>
              <View style={infoStyles.value}>
                <GradientNumber
                  value={`${macros.fatGrams} g`}
                  category={category}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </GlassTabBar>
    </View>
  );
};

export default Info;
