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
  selectedChat: Chat | null;
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
  shareImageDialog: boolean;
}

const initialState: ChatModuleState = {
  // openModalId: "",
  selectedChatId: -1,
  selectedChat: null,
  messages: [],
  chats: [],
  tokensBoxWarningState: "",
  totalPromptTokens: 0,
  inputBoxTokens: 0,
  sideNavExpanded: true,
  isWaitingRes: false,
  isResponsing: false,
  notiStopGenerate: false,
  shareImageDialog: false,
};

/** Caclulate prompt tokens from Messages */
const calPromptTokensByMessages = (messages: Message[]) => {
  return window.electronAPI.othersIpcRenderer.calMessagesTokens(
    messages
      .filter((msg) => msg.inPrompts || msg.fixedInPrompt)
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
    setShareImageDialog: (state, action: PayloadAction<boolean>) => {
      state.shareImageDialog = action.payload;
    },

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

    setSelectedChatId: (state, action: PayloadAction<Chat>) => {
      state.selectedChatId = action.payload.id;
      state.selectedChat = action.payload;
    },

    setSelectedChat: (state, action: PayloadAction<Chat>) => {
      state.selectedChat = action.payload;
    },

    // Recalculate message tokens
    setMessages: (state, action: PayloadAction<Message[]>) => {
      state.messages = isMessageInPrompts(
        [...action.payload],
        state.selectedChat
      );
      state.totalPromptTokens = calPromptTokensByMessages(state.messages);
    },

    recalMessages: (state) => {
      state.messages = isMessageInPrompts(
        [...state.messages],
        state.selectedChat,
        true
      );
      state.totalPromptTokens = calPromptTokensByMessages(state.messages);
    },

    clearMessages: (state) => {
      state.messages = [];
    },

    setNewGPTMessage: (state, action: PayloadAction<Message>) => {
      state.messages = isMessageInPrompts(
        [...state.messages, action.payload],
        state.selectedChat
      );
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

    setNewUserMessage: (state, action: PayloadAction<Message>) => {
      state.messages = isMessageInPrompts(
        [...state.messages, action.payload],
        state.selectedChat
      );
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
      state.selectedChat = null;
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
      if (state.messages[action.payload].fixedInPrompt) {
        return;
      }

      const messages: Message[] = JSON.parse(JSON.stringify(state.messages));
      messages[action.payload].inPrompts = !messages[action.payload].inPrompts;

      // limitation settings
      const MessagesLimit =
        (state.selectedChat && state.selectedChat.messagesLimit) ??
        (window.electronAPI.storeIpcRenderer.get("max_messages_num") as number);
      const tokensLimit =
        (state.selectedChat && state.selectedChat.tokensLimit) ??
        (window.electronAPI.storeIpcRenderer.get("max_tokens") as number);

      // current tokens in limitation
      const messagesInPrompts = messages.filter(
        (msg) => msg.inPrompts || msg.fixedInPrompt
      );
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

    toggleMesageFixedInPrompt: (
      state,
      aciton: PayloadAction<{ index: number; id: number }>
    ) => {
      // Clone, and toggle
      const messages: Message[] = JSON.parse(JSON.stringify(state.messages));
      messages[aciton.payload.index].fixedInPrompt =
        !state.messages[aciton.payload.index].fixedInPrompt;

      // Get limitation
      const messagesLimit =
        (state.selectedChat && state.selectedChat.messagesLimit) ??
        (window.electronAPI.storeIpcRenderer.get("max_messages_num") as number);

      const tokensLimit =
        (state.selectedChat && state.selectedChat.tokensLimit) ??
        (window.electronAPI.storeIpcRenderer.get("max_tokens") as number);

      // Judge
      const fixedMessages = messages.filter((msg) => msg.fixedInPrompt);
      const tokens = calPromptTokensByMessages(fixedMessages);
      if (messagesLimit !== 0 && fixedMessages.length > messagesLimit) {
        state.tokensBoxWarningState = "messages_limit";
      } else if (tokens > tokensLimit) {
        state.tokensBoxWarningState = "tokens_limit";
      } else {
        state.tokensBoxWarningState = "";
        state.messages = [...messages];
        window.electronAPI.databaseIpcRenderer.updateMessageFieldById(
          aciton.payload.id,
          "fixedInPrompt",
          messages[aciton.payload.index].fixedInPrompt
        );

        // Recal limitation
        state.messages = isMessageInPrompts(messages, state.selectedChat, true);
        state.totalPromptTokens = calPromptTokensByMessages(messages);
      }
    },

    setAllMessageInPromptsToFalse: (state) => {
      state.messages = state.messages.map((msg) => {
        return { ...msg, inPrompts: msg.fixedInPrompt ?? false };
      });
      state.totalPromptTokens = calPromptTokensByMessages(state.messages);
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

    setMessageActionResultByIndex: (
      state,
      action: PayloadAction<{ index: number; text: string }>
    ) => {
      const { index, text } = action.payload;
      state.messages[index].actionResult = text;
    },
    clearMessageActionResultByIndex: (state, action: PayloadAction<number>) => {
      state.messages[action.payload].actionResult = "";
    },

    collapseAllMessages: (state, action: PayloadAction<boolean>) => {
      state.messages = state.messages.map((msg) => {
        if (!msg.fixedInPrompt) {
          msg.collapse = action.payload;
          window.electronAPI.databaseIpcRenderer.updateMessageFieldById(
            msg.id,
            "collapse",
            msg.collapse
          );
        }
        return msg;
      });
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
  toggleMesageFixedInPrompt,
  setTokensBoxWarningStateToFalse,
  setPromptTokens,
  setMessageTokens,
  setTokensBoxWarningStateTo,
  setStreamGPTMessage,
  setStreamGPTMessageStart,
  setIsResponsing,
  setIsWaitingRes,
  setNotiGenerate,
  setMessageActionResultByIndex,
  clearMessageActionResultByIndex,
  recalMessages,
  setSelectedChat,
  collapseAllMessages,
  setAllMessageInPromptsToFalse,
  setShareImageDialog,
} = ChatSlice.actions;

/** Update chats history after created a new chat */
export const updateChatsAfterCreated = (
  chatId: number
): ThunkAction<void, RootState, unknown, AnyAction> => {
  return async (dispatch) => {
    window.electronAPI.databaseIpcRenderer.getChatById(chatId).then((chat) => {
      dispatch(setSelectedChatId(chat));
    });
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
    window.electronAPI.databaseIpcRenderer.getChatById(chatId).then((chat) => {
      dispatch(setSelectedChatId(chat));
    });
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

/** Complete the stream, store the message, and recalculate the limitations. */
export const setStreamGPTMessageDone = (): ThunkAction<
  void,
  RootState,
  unknown,
  AnyAction
> => {
  return async (dispatch, getState) => {
    dispatch(setIsResponsing(false));
    const messages = getState().chat.messages;
    const newMessage = Object.assign({}, messages[messages.length - 1]);
    delete newMessage.id;
    window.electronAPI.databaseIpcRenderer
      .createMessage(newMessage)
      .then((message) => {
        dispatch(
          setMessages([...messages.slice(0, messages.length - 1), message])
        );
      });
  };
};

export default ChatSlice.reducer;
