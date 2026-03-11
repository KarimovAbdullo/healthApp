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
    gap: 4,
    width: "100%",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "rgba(238, 230, 230, 0.79)",
  },
  rowLast: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    width: "100%",
    justifyContent: "space-between",
  },
  scroll: {
    maxHeight: 220,
  },
  scrollContent: {
    paddingBottom: 16,
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

const Info = ({ metrics }: InfoProps) => {
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
        width: "65%",
        marginTop: 10,
        backgroundColor: "rgba(255, 255, 255, 0.05)",
        // paddingRight: 10,
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
          style={infoStyles.scroll}
          contentContainerStyle={infoStyles.scrollContent}
          showsVerticalScrollIndicator={false}
          bounces={true}
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
              <AppText size={14} weight="light">
                Category
              </AppText>
              <AppText size={14} weight="medium">
                {categoryLabel[category]}
              </AppText>
            </View>
            <View style={infoStyles.rowBorder}>
              <AppText size={14} weight="light">
                BMI
              </AppText>
              <GradientNumber value={String(roundedBmi)} category={category} />
            </View>
            <View style={infoStyles.rowLast}>
              <AppText size={14} weight="light">
                Body fat
              </AppText>
              <GradientNumber
                value={`${bodyFatRounded} %`}
                category={category}
              />
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
              <AppText size={14} weight="light">
                Ideal weight range
              </AppText>
              <GradientNumber
                value={`${min} – ${max} kg`}
                category={category}
              />
            </View>
            <View style={infoStyles.rowLast}>
              <AppText size={14} weight="light">
                Extra / missing weight
              </AppText>
              <GradientNumber value={extraLabel} category={category} />
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
              <AppText size={14} weight="light">
                BMR
              </AppText>
              <GradientNumber value={`${bmr} kcal/day`} category={category} />
            </View>
            <View style={infoStyles.rowBorder}>
              <AppText size={14} weight="light">
                Daily calories
              </AppText>
              <GradientNumber value={`${tdee} kcal`} category={category} />
            </View>
            <View style={infoStyles.rowBorder}>
              <AppText size={14} weight="light">
                Calories for weight loss
              </AppText>
              <GradientNumber
                value={`${weightLossCal} kcal/day`}
                category={category}
              />
            </View>
            <View style={infoStyles.rowLast}>
              <AppText size={12} weight="light" color="#9CA3AF">
                Expected loss ≈ 0.5 kg per week
              </AppText>
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
              <AppText size={14} weight="light">
                Recommended water
              </AppText>
              <GradientNumber
                value={`${waterRounded} L/day`}
                category={category}
              />
            </View>
            <View style={infoStyles.rowBorder}>
              <AppText size={14} weight="light">
                Protein
              </AppText>
              <GradientNumber
                value={`${macros.proteinGrams} g`}
                category={category}
              />
            </View>
            <View style={infoStyles.rowBorder}>
              <AppText size={14} weight="light">
                Carbs
              </AppText>
              <GradientNumber
                value={`${macros.carbGrams} g`}
                category={category}
              />
            </View>
            <View style={infoStyles.rowLast}>
              <AppText size={14} weight="light">
                Fat
              </AppText>
              <GradientNumber
                value={`${macros.fatGrams} g`}
                category={category}
              />
            </View>
          </View>
        </ScrollView>
      </GlassTabBar>
    </View>
  );
};

export default Info;
