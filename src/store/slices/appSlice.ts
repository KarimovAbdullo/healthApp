import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type AppState = {
  /** Legacy AsyncStorage-dan bir marta initial hydration qilinganini belgilaydi. */
  legacyHydrated: boolean;
};

const initialState: AppState = {
  legacyHydrated: false,
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    markLegacyHydrated(state) {
      state.legacyHydrated = true;
    },
    setLegacyHydrated(state, action: PayloadAction<boolean>) {
      state.legacyHydrated = action.payload;
    },
  },
});

export const { markLegacyHydrated, setLegacyHydrated } = appSlice.actions;
export default appSlice.reducer;
