import { app, ipcMain } from "electron";
import { Op, Sequelize } from "sequelize";
import sqlite3 from "sqlite3";
import { Chat, ChatDefine } from "./models/Chat";
import { Message, MessageDefine } from "./models/Message";
import { Prompt, PromptDefine } from "./models/Prompt";

const dbInit = async () => {
  // sqlite3.verbose();
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
  PromptIns.sync();

  // ipcMain
  // Create message
  ipcMain.on("create-message", async (event, message: Message) => {
    const result = await MessageIns.create({ ...message });
    event.returnValue = result.dataValues.id;
  });

  // Find messages by chatId
  ipcMain.on("get-messages", (event, chatId: number) => {
    MessageIns.findAll({ where: { chatId: chatId } }).then((messages) => {
      event.returnValue = messages.map((message) => message.dataValues);
    });
  });

  // Create chat
  ipcMain.on("create-chat", async (event, chat: Chat) => {
    const result = await ChatIns.create({ ...chat });
    event.returnValue = result.dataValues.id;
  });

  // Get all chats sory by timestamp, recent date first
  ipcMain.on("get-all-chats", (event) => {
    ChatIns.findAll({ order: [["timestamp", "DESC"]] }).then((chats) => {
      event.returnValue = chats.map((chat) => chat.dataValues);
    });
  });

  // Change chat.name by chat.id
  ipcMain.on("update-chat-name", (event, id: number, name: string) => {
    ChatIns.update({ name: name }, { where: { id: id } }).then((result) => {
      event.returnValue = result;
    });
  });

  // Delete chat by chat.id
  ipcMain.on("delete-chat", (event, id: number) => {
    if (!id) {
      event.returnValue = null;
      return;
    }
    ChatIns.destroy({ where: { id: id } }).then((result) => {
      event.returnValue = result;
    });
  });

  // Delete all chats
  ipcMain.on("delete-all-chats", (event) => {
    ChatIns.destroy({ where: {} }).then((result) => {
      event.returnValue = result;
    });
  });

  // Delete message by message.id
  ipcMain.on("delete-message", (event, id: number) => {
    if (!id) {
      event.returnValue = null;
      return;
    }
    try {
      MessageIns.destroy({ where: { id: id } }).then((result) => {
        event.returnValue = result;
      });
    } catch (error) {
      console.log(error.message);
      event.returnValue = null;
    }
  });

  // Search chats by name like
  ipcMain.on("search-chats", (event, name: string) => {
    ChatIns.findAll({
      where: {
        name: {
          [Op.like]: "%" + name + "%",
        },
      },
      order: [["timestamp", "DESC"]],
    }).then((chats) => {
      event.returnValue = chats.map((chat) => chat.dataValues);
    });
  });
  // Create a prompt
  ipcMain.on("create-prompt", async (event, prompt: Prompt) => {
    const result = await PromptIns.create({ ...prompt });
    event.returnValue = result.dataValues.id;
  });
  // Get all prompts
  ipcMain.on("get-all-prompts", (event) => {
    PromptIns.findAll().then((prompts) => {
      event.returnValue = prompts.map((prompt) => prompt.dataValues);
    });
  });
  // Delete prompt by prompt.id
  ipcMain.on("delete-prompt", (event, id: number) => {
    PromptIns.destroy({ where: { id: id } }).then((result) => {
      event.returnValue = result;
    });
  });
  // Update prompt by prompt.id
  ipcMain.on("update-prompt", (event, id: number, prompt: Prompt) => {
    PromptIns.update({ ...prompt }, { where: { id: id } }).then((result) => {
      event.returnValue = result;
    });
  });
  // Search prompts by name like
  ipcMain.on("search-prompts", (event, name: string) => {
    PromptIns.findAll({
      where: {
        name: {
          [Op.like]: "%" + name + "%",
        },
      },
    }).then((prompts) => {
      event.returnValue = prompts.map((prompt) => prompt.dataValues);
    });
  });
  // Get prompt by id
  ipcMain.on("get-prompt", (event, id: number) => {
    PromptIns.findByPk(id).then((prompt) => {
      event.returnValue = prompt.dataValues;
    });
  });
};

export { dbInit };
