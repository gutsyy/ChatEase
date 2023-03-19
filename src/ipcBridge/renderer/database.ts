import { ipcRenderer } from "electron";
import { Message } from "../../database/models/Message";
import { Chat } from "../../database/models/Chat";
import { Prompt } from "../../database/models/Prompt";

export interface DatabaseIpcRenderer {
  createChat: (chat: Chat) => number;
  createMessage: (msg: Message) => number;
  getAllChats: () => Chat[];
  getMessages: (chatId: number) => Message[];
  updateChatName: (id: number, name: string) => void;
  deleteChat: (id: number) => void;
  deleteMessage: (id: number) => void;
  deleteAllChats: () => void;
  searchChats: (keyword: string) => Chat[];
  createPrompt: (prompt: Prompt) => number;
  getAllPrompts: () => Prompt[];
  deletePrompt: (id: number) => void;
  updatePrompt: (id: number, prompt: Prompt) => void;
  searchPrompt: (name: string) => Prompt[];
  getPromptById: (id: number) => Prompt;
}

export const databaseIpcRenderer: DatabaseIpcRenderer = {
  createChat: (chat: Chat) => ipcRenderer.sendSync("create-chat", chat),
  createMessage: (msg) => ipcRenderer.sendSync("create-message", msg),
  getAllChats: () => ipcRenderer.sendSync("get-all-chats"),
  getMessages: (chatId) => ipcRenderer.sendSync("get-messages", chatId),
  updateChatName: (id, name) =>
    ipcRenderer.sendSync("update-chat-name", id, name),
  deleteChat: (id) => ipcRenderer.sendSync("delete-chat", id),
  deleteMessage: (id) => ipcRenderer.sendSync("delete-message", id),
  deleteAllChats: () => ipcRenderer.sendSync("delete-all-chats"),
  searchChats: (keyword) => ipcRenderer.sendSync("search-chats", keyword),
  createPrompt: (prompt) => ipcRenderer.sendSync("create-prompt", prompt),
  getAllPrompts: () => ipcRenderer.sendSync("get-all-prompts"),
  deletePrompt: (id) => ipcRenderer.sendSync("delete-prompt", id),
  updatePrompt: (id, prompt) =>
    ipcRenderer.sendSync("update-prompt", id, prompt),
  searchPrompt: (name) => ipcRenderer.sendSync("search-prompts", name),
  getPromptById: (id) => ipcRenderer.sendSync("get-prompt", id),
};
