import { createAsyncThunk } from "@reduxjs/toolkit";
import moment from "moment";
import { loadFoodState, type FoodState } from "@/utils/foodStorage";
import { loadWaterState, type WaterState } from "@/utils/waterStorage";
import { loadUserProfile, type UserProfile } from "@/utils/userProfileStorage";
import { getSession, type StepSession } from "@/utils/storage";
import { hydrateFoodFromLegacy } from "@/store/slices/foodSlice";
import { hydrateWaterFromLegacy } from "@/store/slices/waterSlice";
import { hydrateProfileFromLegacy } from "@/store/slices/profileSlice";
import {
  hydrateStepSessionFromLegacy,
} from "@/store/slices/stepSessionSlice";
import { markLegacyHydrated } from "@/store/slices/appSlice";
import { setUsageStartDateIfEmpty } from "@/store/slices/dailyResultsSlice";

// Legacy AsyncStorage -> Redux (first app run after installing redux).
export const hydrateLegacyState = createAsyncThunk(
  "app/hydrateLegacyState",
  async (_, { dispatch, getState }) => {
    const state = getState() as { app?: { legacyHydrated?: boolean } };

    if (!state?.app?.legacyHydrated) {
      const [water, food, profile, session] = await Promise.all([
        loadWaterState(),
        loadFoodState(),
        loadUserProfile(),
        getSession(),
      ]);

      if (water) {
        dispatch(hydrateWaterFromLegacy(water as WaterState));
      }
      if (food) {
        dispatch(hydrateFoodFromLegacy(food as FoodState));
      }
      if (profile) {
        dispatch(hydrateProfileFromLegacy(profile as UserProfile));
      }
      if (session) {
        dispatch(hydrateStepSessionFromLegacy(session as StepSession));
      }

      dispatch(markLegacyHydrated());
    }

    const next = getState() as {
      profile: UserProfile | null;
      food: FoodState;
      water: WaterState;
      dailyResults: { usageStartDate: string | null };
    };

    if (next.profile && next.dailyResults.usageStartDate == null) {
      const dates: string[] = [];
      for (const h of next.food.history ?? []) {
        if (h?.date) dates.push(h.date);
      }
      for (const h of next.water.history ?? []) {
        if (h?.date) dates.push(h.date);
      }
      const start =
        dates.length > 0
          ? dates.reduce((a, b) => (a < b ? a : b))
          : moment().format("YYYY-MM-DD");
      dispatch(setUsageStartDateIfEmpty(start));
    }
  },
);

