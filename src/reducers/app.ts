import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { isMessageInPrompts } from "../services/openAI/isMessageInPrompts";
import { Chat } from "../database/models/Chat";
import { Message } from "../database/models/Message";

interface appState {
  selectedMode: string;
  openModalId: string;
  selectedChatId: number;
  messages: Message[];
  chats: Chat[];
  tokensBoxWarningState: "" | "tokens_limit" | "messages_limit";
  promptTokens: number;
  messageTokens: number;
  sideNavExpanded: boolean;
  isWaitingRes: boolean;
  isResponsing: boolean;
  notiStopGenerate: boolean;
}

const initialState: appState = {
  selectedMode: "chat",
  openModalId: "",
  selectedChatId: -1,
  messages: [],
  chats: [],
  tokensBoxWarningState: "",
  promptTokens: 0,
  messageTokens: 0,
  sideNavExpanded: true,
  isWaitingRes: false,
  isResponsing: false,
  notiStopGenerate: false,
};

const calPromptTokens = (messages: Message[]) => {
  return window.electronAPI.othersIpcRenderer.calMessagesTokens(
    messages
      .filter((msg) => msg.inPrompts)
      .map((msg) => {
        return {
          role: msg.sender,
          content: msg.text,
        };
      })
  );
};

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setNotiGenerate: (state, action: PayloadAction<boolean>) => {
      state.notiStopGenerate = action.payload;
    },

    setTokensBoxWarningState: (
      state,
      action: PayloadAction<"" | "tokens_limit" | "messages_limit">
    ) => {
      state.tokensBoxWarningState = action.payload;
    },

    setPromptTokens: (state, action: PayloadAction<number>) => {
      state.promptTokens = action.payload;
    },

    setMessageTokens: (state, action: PayloadAction<string>) => {
      if (action.payload) {
        state.messageTokens =
          window.electronAPI.othersIpcRenderer.calMessagesTokens(
            [{ role: "user", content: action.payload }],
            true
          );
      } else {
        state.messageTokens = 0;
      }
    },

    setSelectedMode: (state, action: PayloadAction<string>) => {
      state.selectedMode = action.payload;
    },
    setOpenModalId: (state, action: PayloadAction<string>) => {
      state.openModalId = action.payload;
    },
    setSelectedChatId: (state, action: PayloadAction<number>) => {
      state.selectedChatId = action.payload;
    },
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = isMessageInPrompts([...action.payload]);
      state.promptTokens = calPromptTokens([...action.payload]);
    },
    clearMessages: (state) => {
      state.messages = [];
    },

    setNewGPTMessage: (state, action: PayloadAction<Message>) => {
      state.messages = isMessageInPrompts([...state.messages, action.payload]);
      state.promptTokens = calPromptTokens([...state.messages]);
    },

    setStreamGPTMessageStart: (state, action: PayloadAction<Message>) => {
      state.messages = [...state.messages, action.payload];
    },

    setStreamGPTMessage: (
      state,
      action: PayloadAction<{ chatId: number; text: string }>
    ) => {
      if (
        state.messages.length > 0 &&
        state.messages[0].chatId === action.payload.chatId
      ) {
        state.messages[state.messages.length - 1].text += action.payload.text;
      }
    },

    setStreamGPTMessageDone: (state) => {
      state.isResponsing = false;
      // 回答完成，计算tokens
      state.messages = isMessageInPrompts([...state.messages]);
      window.electronAPI.databaseIpcRenderer.createMessage(
        state.messages[state.messages.length - 1]
      );
      state.promptTokens = calPromptTokens([...state.messages]);
    },

    setNewUserMessage: (state, action: PayloadAction<Message>) => {
      state.messages = isMessageInPrompts([...state.messages, action.payload]);
      state.promptTokens = calPromptTokens([...state.messages]);
      state.messageTokens = 0;
    },

    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = [...action.payload];
    },

    // 新建会话
    newChat: (state) => {
      if (state.isResponsing) {
        return;
      }
      state.selectedChatId = -1;
      state.messages = [];
      state.promptTokens = 2;
      state.messageTokens = 0;
    },

    createChat: (state, action: PayloadAction<number>) => {
      state.selectedChatId = action.payload;
      // 刷新会话历史
      state.chats = window.electronAPI.databaseIpcRenderer.getAllChats();
    },

    // 聊天记录切换
    selectedChatChange: (state, action: PayloadAction<number>) => {
      if (state.isResponsing || state.isWaitingRes) {
        state.notiStopGenerate = true;
        return;
      }
      state.selectedChatId = action.payload;
      const messages = window.electronAPI.databaseIpcRenderer.getMessages(
        action.payload
      );
      state.messages = isMessageInPrompts(messages);
      state.promptTokens = calPromptTokens(state.messages);
    },

    setIsResponsing: (state, action: PayloadAction<boolean>) => {
      state.isWaitingRes = action.payload;
      if (window.electronAPI.storeIpcRenderer.get("stream_enable")) {
        state.isResponsing = action.payload;
      }
    },

    // update messages
    updateMessages: (state, action: PayloadAction<number>) => {
      state.messages = isMessageInPrompts(
        window.electronAPI.databaseIpcRenderer.getMessages(action.payload)
      );
      state.promptTokens = calPromptTokens(state.messages);
    },

    // toggle message.inPrompts
    toggleMessagePrompt: (state, action: PayloadAction<number>) => {
      const messages: Message[] = JSON.parse(JSON.stringify(state.messages));
      messages[action.payload].inPrompts = !messages[action.payload].inPrompts;
      // limit settings
      const messages_limit_num = window.electronAPI.storeIpcRenderer.get(
        "max_messages_num"
      ) as number;
      const tokens_limit = window.electronAPI.storeIpcRenderer.get(
        "max_tokens"
      ) as number;
      // current tokens in limitation
      const messagesInPrompts = messages.filter((msg) => msg.inPrompts);

      const tokensInPrompts =
        window.electronAPI.othersIpcRenderer.calMessagesTokens(
          messages
            .filter((msg) => msg.inPrompts)
            .map((msg) => {
              return {
                role: msg.sender,
                content: msg.text,
              };
            })
        );

      // 判断
      if (
        messages_limit_num !== 0 &&
        messagesInPrompts.length > messages_limit_num
      ) {
        state.tokensBoxWarningState = "messages_limit";
      } else if (tokensInPrompts > tokens_limit) {
        state.tokensBoxWarningState = "tokens_limit";
      } else {
        state.tokensBoxWarningState = "";
        state.messages = [...messages];
        state.promptTokens = tokensInPrompts;
      }
    },

    setTokensBoxWarningStateToFalse: (state) => {
      state.tokensBoxWarningState = "";
    },

    setTokensBoxWarningStateTo: (
      state,
      action: PayloadAction<"" | "tokens_limit" | "messages_limit">
    ) => {
      state.tokensBoxWarningState = action.payload;
    },

    toggleSideNav: (state) => {
      state.sideNavExpanded = !state.sideNavExpanded;
    },

    setIsWaitingRes: (state, action: PayloadAction<boolean>) => {
      state.isWaitingRes = action.payload;
    },
  },
});

export const {
  setSelectedMode,
  setOpenModalId,
  setSelectedChatId,
  setMessages,
  clearMessages,
  setNewGPTMessage,
  setChats,
  newChat,
  setNewUserMessage,
  selectedChatChange,
  updateMessages,
  setTokensBoxWarningState,
  toggleMessagePrompt,
  setTokensBoxWarningStateToFalse,
  setPromptTokens,
  setMessageTokens,
  setTokensBoxWarningStateTo,
  createChat,
  toggleSideNav,
  setStreamGPTMessage,
  setStreamGPTMessageDone,
  setStreamGPTMessageStart,
  setIsResponsing,
  setIsWaitingRes,
  setNotiGenerate,
} = appSlice.actions;

export default appSlice.reducer;
