import { app, ipcMain } from "electron";
import { Op, Sequelize } from "sequelize";
import sqlite3 from "sqlite3";
import { initialPrompts } from "./initialDatas";
import { Chat, ChatDefine } from "./models/Chat";
import { Message, MessageDefine } from "./models/Message";
import { Prompt, PromptDefine } from "./models/Prompt";
import { syncOrCreateTableAndBulkCreateInitialDatas } from "./utils";

const dbInit = async () => {
  const sqlitePath = app.getPath("userData") + "/database.db";
  new sqlite3.Database(sqlitePath);
  const sequelize = new Sequelize({
    dialect: "sqlite",
    dialectModule: sqlite3,
    storage: sqlitePath,
  });
  const MessageIns = sequelize.define(MessageDefine.name, MessageDefine.model, {
    createdAt: false,
    updatedAt: false,
  });
  MessageIns.sync();
  const ChatIns = sequelize.define(ChatDefine.name, ChatDefine.model, {
    createdAt: false,
    updatedAt: false,
  });

  ChatIns.sync();

  const PromptIns = sequelize.define(PromptDefine.name, PromptDefine.model, {
    createdAt: false,
    updatedAt: false,
  });

  await syncOrCreateTableAndBulkCreateInitialDatas(
    sequelize,
    PromptIns,
    initialPrompts
  );

  // ipcMain
  // Create message
  ipcMain.handle("create-message", async (event, message: Message) => {
    try {
      const result = await MessageIns.create({ ...message });
      return result.dataValues;
    } catch (err) {
      throw new Error("failed");
    }
  });

  // Find messages by chatId
  ipcMain.handle("get-messages", async (event, chatId: number) => {
    try {
      const messages = await MessageIns.findAll({ where: { chatId: chatId } });
      return messages.map((message) => message.dataValues);
    } catch (err) {
      throw new Error("failed");
    }
  });

  // Create chat
  ipcMain.handle("create-chat", async (event, chat: Chat) => {
    try {
      const result = await ChatIns.create({ ...chat });
      return result.dataValues.id;
    } catch (err) {
      throw new Error("failed");
    }
  });

  // Get all chats sory by timestamp, recent date first
  ipcMain.handle("get-all-chats", async (event) => {
    try {
      const chats = await ChatIns.findAll({ order: [["timestamp", "DESC"]] });
      return chats.map((chat) => chat.dataValues);
    } catch (err) {
      throw new Error("failed");
    }
  });

  // Change chat.name by chat.id
  ipcMain.handle(
    "update-chat-name",
    async (event, id: number, name: string) => {
      try {
        const result = await ChatIns.update(
          { name: name },
          { where: { id: id } }
        );
        return result;
      } catch (err) {
        throw new Error("failed");
      }
    }
  );

  // Delete chat by chat.id
  ipcMain.handle("delete-chat", async (event, id: number) => {
    try {
      return sequelize.transaction(async (transaction) => {
        await MessageIns.destroy({ where: { chatId: id }, transaction });
        await ChatIns.destroy({ where: { id: id }, transaction });
      });
    } catch (err) {
      throw new Error("failed");
    }
  });

  // Delete all chats
  ipcMain.handle("delete-all-chats", async (event) => {
    try {
      const result = await ChatIns.destroy({ where: {} });
      return result;
    } catch (err) {
      throw new Error("failed");
    }
  });

  // Delete message by message.id
  ipcMain.handle("delete-message", async (event, id: number) => {
    if (!id) {
      return null;
    }
    try {
      const result = await MessageIns.destroy({ where: { id: id } });
      return result;
    } catch (err) {
      throw new Error("failed");
    }
  });

  // Search chats by name like
  ipcMain.handle("search-chats", async (event, name: string) => {
    try {
      const chats = await ChatIns.findAll({
        where: {
          name: {
            [Op.like]: "%" + name + "%",
          },
        },
        order: [["timestamp", "DESC"]],
      });
      return chats.map((chat) => chat.dataValues);
    } catch (err) {
      throw new Error("failed");
    }
  });
  // Create a prompt
  ipcMain.handle("create-prompt", async (event, prompt: Prompt) => {
    try {
      const result = await PromptIns.create({ ...prompt });
      return result.dataValues.id;
    } catch (err) {
      throw new Error("failed");
    }
  });
  // Get all prompts
  ipcMain.handle("get-all-prompts", async (event) => {
    try {
      const prompts = await PromptIns.findAll();
      return prompts.map((prompt) => prompt.dataValues);
    } catch (err) {
      throw new Error("failed");
    }
  });
  // Delete prompt by prompt.id
  ipcMain.handle("delete-prompt", async (event, id: number) => {
    try {
      const result = await PromptIns.destroy({ where: { id: id } });
      return result;
    } catch (err) {
      throw new Error("failed");
    }
  });
  // Update prompt by prompt.id
  ipcMain.handle("update-prompt", async (event, id: number, prompt: Prompt) => {
    try {
      const result = await PromptIns.update(
        { ...prompt },
        { where: { id: id } }
      );
      return result;
    } catch (err) {
      throw new Error("failed");
    }
  });
  // Search prompts by name like
  ipcMain.handle("search-prompts", async (event, name: string) => {
    try {
      const prompts = await PromptIns.findAll({
        where: {
          name: {
            [Op.like]: "%" + name + "%",
          },
        },
      });
      return prompts.map((prompt) => prompt.dataValues);
    } catch (err) {
      throw new Error("failed");
    }
  });
  // Get prompt by id
  ipcMain.handle("get-prompt", async (event, id: number) => {
    try {
      const prompt = await PromptIns.findByPk(id);
      return prompt.dataValues;
    } catch (err) {
      throw new Error("failed");
    }
  });

  // Get Prompts by ids
  ipcMain.handle("get-prompts-by-ids", async (event, ids: number[]) => {
    try {
      const prompts = await PromptIns.findAll({
        where: {
          id: ids,
        },
      });
      return prompts.map((prompt) => prompt.dataValues);
    } catch {
      throw new Error("failed");
    }
  });

  // set Message.collapse by message.id
  ipcMain.handle(
    "set-message-collapse",
    async (event, id: number, collapse: boolean) => {
      try {
        const result = await MessageIns.update(
          { collapse: collapse },
          { where: { id: id } }
        );
        return result;
      } catch (err) {
        throw new Error("failed");
      }
    }
  );
};

export { dbInit };
