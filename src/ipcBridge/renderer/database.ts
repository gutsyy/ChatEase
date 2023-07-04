import { ipcRenderer } from "electron";
import { Message } from "../../database/models/Message";
import { Chat } from "../../database/models/Chat";
import { Prompt } from "../../database/models/Prompt";

type GetByKey<T, K extends keyof T> = T[K];

export interface DatabaseIpcRenderer {
  createChat: (chat: Chat) => Promise<number>;
  createMessage: (msg: Message) => Promise<Message>;
  getAllChats: () => Promise<Chat[]>;
  getMessages: (chatId: number) => Promise<Message[]>;
  updateChatName: (id: number, name: string) => Promise<void>;
  deleteChat: (id: number) => Promise<void>;
  deleteMessage: (id: number) => Promise<void>;
  deleteAllChats: () => Promise<void>;
  searchChats: (keyword: string) => Promise<Chat[]>;
  createPrompt: (prompt: Prompt) => Promise<number>;
  getAllPrompts: () => Promise<Prompt[]>;
  deletePrompt: (id: number) => Promise<void>;
  updatePrompt: (id: number, prompt: Prompt) => Promise<void>;
  searchPrompt: (name: string) => Promise<Prompt[]>;
  getPromptById: (id: number) => Promise<Prompt>;
  getPromptsByIds: (ids: number[]) => Promise<Prompt[]>;
  setMessageCollapseById: (id: number, collapse: boolean) => Promise<void>;
  updateMessageFieldById: (
    id: number,
    field: keyof Message,
    value: any
  ) => Promise<Message>;
  updateChatFieldById: (
    id: number,
    field: keyof Chat,
    value: any
  ) => Promise<Chat>;
  getChatFieldById: (
    id: number,
    field: keyof Chat
  ) => Promise<GetByKey<Chat, keyof Chat>>;
  getChatById: (id: number) => Promise<Chat>;
  exportAllChats: () => Promise<null>;
  exportAllPrompts: () => Promise<null>;
  importAllChats: () => Promise<boolean>;
  importAllPrompts: () => Promise<boolean>;
  searchMessages: (chatId: number, text: string) => Promise<Message[]>;
}

export const databaseIpcRenderer: DatabaseIpcRenderer = {
  createChat: (chat: Chat) => ipcRenderer.invoke("create-chat", chat),
  createMessage: (msg) => ipcRenderer.invoke("create-message", msg),
  getAllChats: () => ipcRenderer.invoke("get-all-chats"),
  getMessages: (chatId) => ipcRenderer.invoke("get-messages", chatId),
  updateChatName: (id, name) =>
    ipcRenderer.invoke("update-chat-name", id, name),
  deleteChat: (id) => ipcRenderer.invoke("delete-chat", id),
  deleteMessage: (id) => ipcRenderer.invoke("delete-message", id),
  deleteAllChats: () => ipcRenderer.invoke("delete-all-chats"),
  searchChats: (keyword) => ipcRenderer.invoke("search-chats", keyword),
  createPrompt: (prompt) => ipcRenderer.invoke("create-prompt", prompt),
  getAllPrompts: () => ipcRenderer.invoke("get-all-prompts"),
  deletePrompt: (id) => ipcRenderer.invoke("delete-prompt", id),
  updatePrompt: (id, prompt) => ipcRenderer.invoke("update-prompt", id, prompt),
  searchPrompt: (name) => ipcRenderer.invoke("search-prompts", name),
  getPromptById: (id) => ipcRenderer.invoke("get-prompt", id),
  getPromptsByIds: (ids) => ipcRenderer.invoke("get-prompts-by-ids", ids),
  setMessageCollapseById: (id, collapse) =>
    ipcRenderer.invoke("set-message-collapse", id, collapse),
  updateChatFieldById: (id, field, value) =>
    ipcRenderer.invoke("update-chat-field-by-id", id, field, value),
  updateMessageFieldById: (id, field, value) =>
    ipcRenderer.invoke("update-message-field-by-id", id, field, value),
  getChatFieldById: (id, field) =>
    ipcRenderer.invoke("get-chat-field-by-id", id, field),
  getChatById: (id) => {
    return ipcRenderer.invoke("get-chat-by-id", id);
  },
  exportAllChats: () => ipcRenderer.invoke("export-all-chats"),
  exportAllPrompts: () => ipcRenderer.invoke("export-all-prompts"),
  importAllChats: () => ipcRenderer.invoke("import-all-chats"),
  importAllPrompts: () => ipcRenderer.invoke("import-all-prompts"),
  searchMessages: (chatId, text) =>
    ipcRenderer.invoke("search-messages", chatId, text),
};
