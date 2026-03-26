import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { UserProfile } from "@/utils/userProfileStorage";

export type ProfileState = UserProfile | null;

const profileSlice = createSlice({
  name: "profile",
  initialState: null as ProfileState,
  reducers: {
    hydrateProfileFromLegacy(_state, action: PayloadAction<UserProfile>) {
      return action.payload;
    },
    saveProfile(_state, action: PayloadAction<UserProfile>) {
      return action.payload;
    },
    clearProfile() {
      return null;
    },
  },
});

export const { hydrateProfileFromLegacy, saveProfile, clearProfile } =
  profileSlice.actions;
export default profileSlice.reducer;

