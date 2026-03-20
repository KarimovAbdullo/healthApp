import AsyncStorage from "@react-native-async-storage/async-storage";

export type UserProfile = {
  name: string;
  heightCm: number;
  weightKg: number;
  age: number;
  gender: "male" | "female";
  activityLevel: "sedentary" | "light" | "moderate" | "active";
};

const USER_PROFILE_KEY = "health_app_user_profile_v1";

export async function loadUserProfile(): Promise<UserProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(USER_PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<UserProfile>;
    if (
      typeof parsed?.name !== "string" ||
      typeof parsed?.heightCm !== "number" ||
      typeof parsed?.weightKg !== "number" ||
      typeof parsed?.age !== "number" ||
      (parsed?.gender !== "male" && parsed?.gender !== "female") ||
      !["sedentary", "light", "moderate", "active"].includes(
        parsed?.activityLevel as string,
      )
    ) {
      return null;
    }
    return parsed as UserProfile;
  } catch {
    return null;
  }
}

export async function saveUserProfile(profile: UserProfile) {
  try {
    await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
  } catch {
    // ignore storage failures
  }
}
