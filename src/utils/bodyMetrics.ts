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

  let baseKm = 3;
  let minKm = 3;
  let maxKm = 5;

  if (extraWeight <= 0) {
    baseKm = 4;
    minKm = 3;
    maxKm = 5;
  } else if (extraWeight <= 5) {
    baseKm = 5;
    minKm = 4;
    maxKm = 6;
  } else if (extraWeight <= 15) {
    baseKm = 6.5;
    minKm = 5;
    maxKm = 8;
  } else if (extraWeight <= 30) {
    baseKm = 8;
    minKm = 6;
    maxKm = 10;
  } else {
    baseKm = 10;
    minKm = 8;
    maxKm = 12;
  }

  const adjust =
    activityLevel === "sedentary"
      ? 2
      : activityLevel === "light"
        ? 1
        : activityLevel === "active"
          ? -1
          : 0;

  const dailyKm = Math.max(3, Math.round(baseKm + adjust));
  const recommendedMinKm = Math.max(3, Math.round(minKm + adjust));
  const recommendedMaxKm = Math.max(recommendedMinKm, Math.round(maxKm + adjust));

  return {
    idealWeight,
    extraWeight,
    dailyKm,
    recommendedMinKm,
    recommendedMaxKm,
  };
};
