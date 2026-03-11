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

