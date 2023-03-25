import {
  AnyAction,
  createSlice,
  Dispatch,
  PayloadAction,
  ThunkAction,
} from "@reduxjs/toolkit";
import { isMessageInPrompts } from "../services/openAI/isMessageInPrompts";
import { Chat } from "../database/models/Chat";
import { Message } from "../database/models/Message";
import { RootState } from "../store";

interface ChatModuleState {
  selectedChatId: number;
  messages: Message[];
  chats: Chat[];
  tokensBoxWarningState: "" | "tokens_limit" | "messages_limit";
  // All messages tokens in prompt
  totalPromptTokens: number;
  // Input box tokens
  inputBoxTokens: number;
  sideNavExpanded: boolean;
  isWaitingRes: boolean;
  isResponsing: boolean;
  notiStopGenerate: boolean;
}

const initialState: ChatModuleState = {
  // openModalId: "",
  selectedChatId: -1,
  messages: [],
  chats: [],
  tokensBoxWarningState: "",
  totalPromptTokens: 0,
  inputBoxTokens: 0,
  sideNavExpanded: true,
  isWaitingRes: false,
  isResponsing: false,
  notiStopGenerate: false,
};

/** Caclulate prompt tokens from Messages */
const calPromptTokensByMessages = (messages: Message[]) => {
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

export const ChatSlice = createSlice({
  name: "chat",
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
      state.totalPromptTokens = action.payload;
    },

    // Caculater single Message Tokens
    setMessageTokens: (state, action: PayloadAction<string>) => {
      if (action.payload) {
        state.inputBoxTokens =
          window.electronAPI.othersIpcRenderer.calMessagesTokens(
            [{ role: "user", content: action.payload }],
            true
          );
      } else {
        state.inputBoxTokens = 0;
      }
    },

    setSelectedChatId: (state, action: PayloadAction<number>) => {
      state.selectedChatId = action.payload;
    },

    // Recalculate message tokens
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = isMessageInPrompts([...action.payload]);
      state.totalPromptTokens = calPromptTokensByMessages([...action.payload]);
    },

    clearMessages: (state) => {
      state.messages = [];
    },

    setNewGPTMessage: (state, action: PayloadAction<Message>) => {
      state.messages = isMessageInPrompts([...state.messages, action.payload]);
      state.totalPromptTokens = calPromptTokensByMessages([...state.messages]);
    },

    /** Add a new message when starting the stream. */
    setStreamGPTMessageStart: (state, action: PayloadAction<Message>) => {
      state.messages = [...state.messages, action.payload];
    },

    /** Continuous update of Message.text while Stream is in progress. */
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

    /** Complete the stream, store the message, and recalculate the limitations. */
    setStreamGPTMessageDone: (state) => {
      state.isResponsing = false;
      window.electronAPI.databaseIpcRenderer.createMessage(
        Object.assign({}, state.messages[state.messages.length - 1])
      );
      state.messages = isMessageInPrompts([...state.messages]);
      state.totalPromptTokens = calPromptTokensByMessages([...state.messages]);
    },

    setNewUserMessage: (state, action: PayloadAction<Message>) => {
      state.messages = isMessageInPrompts([...state.messages, action.payload]);
      state.totalPromptTokens = calPromptTokensByMessages([...state.messages]);
      state.inputBoxTokens = 0;
    },

    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.chats = [...action.payload];
    },

    /** Create a new chat session */
    newChat: (state) => {
      if (state.isResponsing) {
        return;
      }
      state.selectedChatId = -1;
      state.messages = [];
      state.totalPromptTokens = 2;
      state.inputBoxTokens = 0;
    },

    setIsResponsing: (state, action: PayloadAction<boolean>) => {
      state.isWaitingRes = action.payload;
      if (window.electronAPI.storeIpcRenderer.get("stream_enable")) {
        state.isResponsing = action.payload;
      }
    },

    /** Caculate limitation and Toggle message.inPrompts */
    toggleMessagePrompt: (state, action: PayloadAction<number>) => {
      const messages: Message[] = JSON.parse(JSON.stringify(state.messages));
      messages[action.payload].inPrompts = !messages[action.payload].inPrompts;
      // limitation settings
      const MessagesLimit = window.electronAPI.storeIpcRenderer.get(
        "max_messages_num"
      ) as number;
      const tokensLimit = window.electronAPI.storeIpcRenderer.get(
        "max_tokens"
      ) as number;

      // current tokens in limitation
      const messagesInPrompts = messages.filter((msg) => msg.inPrompts);
      const tokensInPrompts = calPromptTokensByMessages(messages);

      // Judge limitation
      if (MessagesLimit !== 0 && messagesInPrompts.length > MessagesLimit) {
        state.tokensBoxWarningState = "messages_limit";
      } else if (tokensInPrompts > tokensLimit) {
        state.tokensBoxWarningState = "tokens_limit";
      } else {
        state.tokensBoxWarningState = "";
        state.messages = [...messages];
        state.totalPromptTokens = tokensInPrompts;
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

    setIsWaitingRes: (state, action: PayloadAction<boolean>) => {
      state.isWaitingRes = action.payload;
    },
  },
});

export const {
  setSelectedChatId,
  setMessages,
  clearMessages,
  setNewGPTMessage,
  setChats,
  newChat,
  setNewUserMessage,
  setTokensBoxWarningState,
  toggleMessagePrompt,
  setTokensBoxWarningStateToFalse,
  setPromptTokens,
  setMessageTokens,
  setTokensBoxWarningStateTo,
  setStreamGPTMessage,
  setStreamGPTMessageDone,
  setStreamGPTMessageStart,
  setIsResponsing,
  setIsWaitingRes,
  setNotiGenerate,
} = ChatSlice.actions;

/** Update chats history after created a new chat */
export const updateChatsAfterCreated = (
  chatId: number
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    dispatch(setSelectedChatId(chatId));
    return window.electronAPI.databaseIpcRenderer
      .getAllChats()
      .then((chats) => {
        dispatch(setChats(chats));
      });
  };
};

/** Switching chat session */
export const switchingChatSession = (
  chatId: number
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch: Dispatch<AnyAction>, getState) => {
    if (getState().chat.isResponsing || getState().chat.isWaitingRes) {
      dispatch(setNotiGenerate(true));
      return;
    }
    dispatch(setSelectedChatId(chatId));
    return window.electronAPI.databaseIpcRenderer
      .getMessages(chatId)
      .then((messages) => {
        dispatch(setMessages(messages));
      });
  };
};

/** Update Messages */
export const updateMessages = (
  chatId: number
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    return window.electronAPI.databaseIpcRenderer
      .getMessages(chatId)
      .then((messages) => {
        dispatch(setMessages(messages));
      });
  };
};

export default ChatSlice.reducer;
