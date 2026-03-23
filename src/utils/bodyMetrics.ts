export type BodyCategory =
  | "veryThin"
  | "normal"
  | "overweight"
  | "obese"
  | "veryObese";

export const getBmi = (weightKg: number, heightCm: number) => {
  const h = heightCm / 100;
  if (!h) return 0;
  return weightKg / (h * h);
};

export const getBodyCategory = (
  weightKg: number,
  heightCm: number,
): BodyCategory => {
  const bmi = getBmi(weightKg, heightCm);

  if (bmi < 18.5) return "veryThin";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  if (bmi < 35) return "obese";
  return "veryObese";
};

export const getIdealWeightRange = (heightCm: number) => {
  const h = heightCm / 100;
  if (!h) return { min: 0, max: 0 };
  const min = 18.5 * h * h;
  const max = 24.9 * h * h;
  return {
    min: Math.round(min),
    max: Math.round(max),
  };
};

export const getExtraOrMissingWeight = (weightKg: number, heightCm: number) => {
  const { min, max } = getIdealWeightRange(heightCm);
  if (!min || !max) {
    return { amount: 0, type: "none" as const };
  }
  if (weightKg > max) {
    return { amount: Math.round(weightKg - max), type: "extra" as const };
  }
  if (weightKg < min) {
    return { amount: Math.round(min - weightKg), type: "missing" as const };
  }
  return { amount: 0, type: "none" as const };
};

export type Gender = "male" | "female";

/** Daily step goal on Home (by BMI category + sex). */
export function getDailyStepGoalSteps(
  category: BodyCategory,
  gender: Gender,
): number {
  if (category === "veryThin" || category === "normal") {
    return gender === "female" ? 1000 : 1500;
  }
  if (category === "overweight") {
    return gender === "female" ? 2000 : 2500;
  }
  // obese, veryObese
  return gender === "female" ? 3500 : 4500;
}

export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active";

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
};

export const getBMR = (
  weightKg: number,
  heightCm: number,
  age: number,
  gender: Gender,
) => {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
  return gender === "male" ? base + 5 : base - 161;
};

export const getTDEE = (bmr: number, activityLevel: ActivityLevel) =>
  bmr * ACTIVITY_MULTIPLIERS[activityLevel];

export const getBodyFat = (
  bmi: number,
  age: number,
  gender: Gender,
) => {
  const term = 1.2 * bmi + 0.23 * age;
  return gender === "male" ? term - 16.2 : term - 5.4;
};

export const getWaterLiters = (weightKg: number) =>
  weightKg * 0.033;

export const getMacros = (tdee: number) => {
  const proteinCal = tdee * 0.3;
  const carbCal = tdee * 0.4;
  const fatCal = tdee * 0.3;
  return {
    proteinGrams: Math.round(proteinCal / 4),
    carbGrams: Math.round(carbCal / 4),
    fatGrams: Math.round(fatCal / 9),
  };
};

export const getIdealWeightByBmi22 = (heightCm: number) => {
  const h = heightCm / 100;
  if (!h) return 0;
  return 22 * h * h;
};

export const calculateDailyWalk = ({
  weight,
  height,
  activityLevel,
}: {
  weight: number;
  height: number;
  activityLevel: ActivityLevel;
}) => {
  const idealWeight = getIdealWeightByBmi22(height);
  const extraWeight = weight - idealWeight;

  /** Softer daily walk targets (km) — easier than the original bands, capped */
  const EASY_MAX_KM = 6;
  const EASY_MIN_KM = 2;

  let baseKm = 2.5;
  let minKm = 2;
  let maxKm = 3;

  if (extraWeight <= 0) {
    baseKm = 2.5;
    minKm = 2;
    maxKm = 3;
  } else if (extraWeight <= 5) {
    baseKm = 3;
    minKm = 2;
    maxKm = 4;
  } else if (extraWeight <= 15) {
    baseKm = 3.5;
    minKm = 3;
    maxKm = 4;
  } else if (extraWeight <= 30) {
    baseKm = 4.5;
    minKm = 3;
    maxKm = 5;
  } else {
    baseKm = 5.5;
    minKm = 4;
    maxKm = 6;
  }

  const adjust =
    activityLevel === "sedentary"
      ? 1
      : activityLevel === "light"
        ? 0.5
        : activityLevel === "active"
          ? -0.5
          : 0;

  let dailyKm = Math.round(baseKm + adjust);
  dailyKm = Math.max(EASY_MIN_KM, Math.min(EASY_MAX_KM, dailyKm));

  let recommendedMinKm = Math.round(minKm + Math.min(0, adjust));
  let recommendedMaxKm = Math.round(maxKm + Math.max(0, adjust));
  recommendedMinKm = Math.max(EASY_MIN_KM, Math.min(EASY_MAX_KM, recommendedMinKm));
  recommendedMaxKm = Math.max(EASY_MIN_KM, Math.min(EASY_MAX_KM, recommendedMaxKm));
  if (recommendedMaxKm < recommendedMinKm) {
    recommendedMaxKm = recommendedMinKm;
  }

  return {
    idealWeight,
    extraWeight,
    dailyKm,
    recommendedMinKm,
    recommendedMaxKm,
  };
};
