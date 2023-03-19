import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Prompt } from "../database/models/Prompt";

interface PromptState {
  prompts: Prompt[];
  selectedPromptId: number;
  refreshPanel: boolean;
  answerContent: string;
  isPromptResponsing: boolean;
}

const initialState: PromptState = {
  prompts: [],
  selectedPromptId: -1,
  refreshPanel: false,
  answerContent: "",
  isPromptResponsing: false,
};

const PromptSlice = createSlice({
  name: "prompt",
  initialState,
  reducers: {
    createPrompt: (state, action: PayloadAction<number>) => {
      state.selectedPromptId = action.payload;
      state.prompts = window.electronAPI.databaseIpcRenderer.getAllPrompts();
    },
    getAllPrompts: (state) => {
      state.prompts = window.electronAPI.databaseIpcRenderer.getAllPrompts();
      state.refreshPanel = !state.refreshPanel;
    },
    // set prompt id
    setSelectedPromptId: (state, action: PayloadAction<number>) => {
      if (action.payload === state.selectedPromptId) {
        return;
      }
      state.isPromptResponsing = false;
      state.answerContent = "";
      state.selectedPromptId = action.payload;
    },
    // setAnswerContent
    setAnswerContent: (state, action: PayloadAction<string>) => {
      if (window.electronAPI.storeIpcRenderer.get("stream_enable")) {
        state.answerContent = state.answerContent + action.payload;
      } else {
        state.answerContent = action.payload;
      }
    },
    // Clear answer content
    clearAnswerContent: (state) => {
      state.answerContent = "";
    },
    // Set isResponsing
    setPromptIsResponsing: (state, action: PayloadAction<boolean>) => {
      if (action.payload) {
        state.answerContent = "";
      }
      state.isPromptResponsing = action.payload;
    },
  },
});

export const {
  createPrompt,
  getAllPrompts,
  setSelectedPromptId,
  setAnswerContent,
  clearAnswerContent,
  setPromptIsResponsing,
} = PromptSlice.actions;

export default PromptSlice.reducer;
