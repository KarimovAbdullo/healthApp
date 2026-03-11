import { AppText } from "@/components/AppText";
import { GlassTabBar } from "@/components/GlowButton";
import {
  BodyCategory,
  getBmi,
  getBodyCategory,
  getExtraOrMissingWeight,
  getIdealWeightRange,
} from "@/utils/bodyMetrics";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";
import { View } from "react-native";
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
        <AppText
          size={14}
          weight="medium"
          style={{ opacity: 0 }}
        >
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

  return (
    <View style={{ width: "65%", marginTop: 10 }}>
      <GlassTabBar
        style={{
          borderRadius: 20,
          shadowColor: "white",
          elevation: 44,
        }}
      >
        <View>
          <View
            style={{
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <AppText size={14} weight="light">
                Category
              </AppText>
              <AppText size={14} weight="medium">
                {categoryLabel[category]}
              </AppText>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                width: "100%",
                justifyContent: "space-between",
                borderBottomWidth: 1,
                borderColor: "rgba(238, 230, 230, 0.79)",
              }}
            >
              <AppText size={14} weight="light">
                BMI
              </AppText>
              <GradientNumber value={String(roundedBmi)} category={category} />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                width: "100%",
                justifyContent: "space-between",
                borderBottomWidth: 1,
                borderColor: "rgba(241, 240, 240, 0.79)",
              }}
            >
              <AppText size={14} weight="light">
                Ideal weight range
              </AppText>
              <GradientNumber
                value={`${min} – ${max} kg`}
                category={category}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <AppText size={14} weight="light">
                Extra / missing weight
              </AppText>
              <GradientNumber value={extraLabel} category={category} />
            </View>
          </View>
        </View>
      </GlassTabBar>
    </View>
  );
};

export default Info;
