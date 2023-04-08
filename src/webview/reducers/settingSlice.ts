import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { appSettings } from "../utils/settings";
import { Settings } from "@/settings/settingsModel";

const initialState: Settings = appSettings.getAll();

export const settingSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setApiKey: (state, action: PayloadAction<string>) => {
      state.open_api_key = action.payload;
      appSettings.set("open_api_key", action.payload);
    },

    setHttpProxy: (state, action: PayloadAction<boolean>) => {
      state.http_proxy = action.payload;
      appSettings.set("http_proxy", action.payload);
    },

    setHttpProxyHost: (state, action: PayloadAction<string>) => {
      state.http_proxy_host = action.payload;
      appSettings.set("http_proxy_host", action.payload);
    },

    setHttpProxyPort: (state, action: PayloadAction<string>) => {
      state.http_proxy_port = action.payload;
      appSettings.set("http_proxy_port", action.payload);
    },

    setHttpProxyUsername: (state, action: PayloadAction<string>) => {
      state.http_proxy_username = action.payload;
      appSettings.set("http_proxy_username", action.payload);
    },

    setHttpProxyPassword: (state, action: PayloadAction<string>) => {
      state.http_proxy_password = action.payload;
      appSettings.set("http_proxy_password", action.payload);
    },

    setLanguage: (state, action: PayloadAction<"en" | "zh">) => {
      state.language = action.payload;
      appSettings.set("language", action.payload);
    },

    setMaxMessagesNum: (state, action: PayloadAction<number>) => {
      state.max_messages_num = action.payload;
      appSettings.set("max_messages_num", action.payload);
    },

    setOpenaiApiOrigin: (state, action: PayloadAction<string>) => {
      state.openai_api_origin = action.payload;
      appSettings.set("openai_api_origin", action.payload);
    },

    setMaxTokens: (state, action: PayloadAction<number>) => {
      state.max_tokens = action.payload;
      appSettings.set("max_tokens", action.payload);
    },

    setStreamEnable: (state, action: PayloadAction<boolean>) => {
      state.stream_enable = action.payload;
      appSettings.set("stream_enable", action.payload);
    },

    setMarkdownCodeScope: (state, action: PayloadAction<string>) => {
      state.markdown_code_scope = action.payload;
      appSettings.set("markdown_code_scope", action.payload);
    },

    setChatInputToolbarItems: (state, action: PayloadAction<number[]>) => {
      state.chat_input_toolbar_items = action.payload;
      appSettings.set("chat_input_toolbar_items", action.payload);
    },

    setMessageToolbarItems: (state, action: PayloadAction<number[]>) => {
      state.message_toolbar_items = action.payload;
      appSettings.set("message_toolbar_items", action.payload);
    },

    setTemperature: (state, action: PayloadAction<number>) => {
      state.temperature = action.payload;
      appSettings.set("temperature", action.payload);
    },

    setTheme: (state, action: PayloadAction<"light" | "dark">) => {
      state.theme = action.payload;
      appSettings.set("theme", action.payload);
    },

    setFontSize: (state, action: PayloadAction<string>) => {
      state.fontSize = action.payload;
      appSettings.set("fontSize", action.payload);
    },
  },
});

export const {
  setApiKey,
  setHttpProxy,
  setHttpProxyHost,
  setHttpProxyPort,
  setHttpProxyUsername,
  setHttpProxyPassword,
  setLanguage,
  setMaxMessagesNum,
  setOpenaiApiOrigin,
  setMaxTokens,
  setStreamEnable,
  setMarkdownCodeScope,
  setChatInputToolbarItems,
  setMessageToolbarItems,
  setTemperature,
  setTheme,
  setFontSize,
} = settingSlice.actions;

export default settingSlice.reducer;
