import { ipcRenderer } from "electron";
import { Message } from "../../database/models/Message";
import { Chat } from "../../database/models/Chat";
import { Prompt } from "../../database/models/Prompt";

export interface DatabaseIpcRenderer {
  createChat: (chat: Chat) => Promise<number>;
  createMessage: (msg: Message) => Promise<number>;
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
};
