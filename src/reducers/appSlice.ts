import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type AppModule = "chat" | "action";

interface AppState {
  selectedAppModule: AppModule;
  sideNavExpanded: boolean; // createChat,
  theme: "light" | "dark";
}

const initialState: AppState = {
  selectedAppModule: "chat",
  sideNavExpanded: true,
  theme:
    (window.electronAPI.storeIpcRenderer.get("theme") as "light" | "dark") ??
    "light",
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

    /** Toggle theme */
    toggleAppTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
      window.electronAPI.storeIpcRenderer.set("theme", action.payload);
      window.electronAPI.othersIpcRenderer.colorScheme(action.payload);
    },
  },
});

export const { setMode, toggleSideNavExpanded, toggleAppTheme } =
  appSlice.actions;

export default appSlice.reducer;
