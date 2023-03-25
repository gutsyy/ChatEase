import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AppModule = "chat" | "action";

interface AppState {
  selectedAppModule: AppModule;
  sideNavExpanded: boolean; // createChat,
}

const initialState: AppState = {
  selectedAppModule: "chat",
  sideNavExpanded: true,
};

export const appSlice = createSlice({
  name: "app",
  initialState: initialState,
  reducers: {
    /** Switching between the selection modules of the app. */
    setMode: (state, action: PayloadAction<AppModule>) => {
      state.selectedAppModule = action.payload;
    },

    /** Toggle Expanded Box */
    toggleSideNavExpanded: (state) => {
      state.sideNavExpanded = !state.sideNavExpanded;
    },
  },
});

export const { setMode, toggleSideNavExpanded } = appSlice.actions;

export default appSlice.reducer;
