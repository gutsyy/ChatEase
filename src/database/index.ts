import { app, BrowserWindow, dialog, ipcMain, shell } from "electron";
import { Op, Sequelize } from "sequelize";
import sqlite3, { Database } from "sqlite3";
import { initialPrompts } from "./initialDatas";
import { Chat, ChatDefine } from "./models/Chat";
import { Message, MessageDefine } from "./models/Message";
import { Prompt, PromptDefine } from "./models/Prompt";
import { syncOrCreateTableAndBulkCreateInitialDatas } from "./utils";
import fs from "fs";
import { promisify } from "util";

const readFilePromise = promisify(fs.readFile);

const database = () => {
  let sequelize: Sequelize | null = null;

  const init = async (window: BrowserWindow) => {
    const sqlitePath = app.getPath("userData") + "/database.db";
    new Database(sqlitePath);
    sequelize = new Sequelize({
      dialect: "sqlite",
      dialectModule: sqlite3,
      storage: sqlitePath,
    });
    const MessageIns = sequelize.define(
      MessageDefine.name,
      MessageDefine.model,
      {
        createdAt: false,
        updatedAt: false,
      }
    );
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
        const messages = await MessageIns.findAll({
          where: { chatId: chatId },
        });
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
    ipcMain.handle("get-all-chats", async () => {
      try {
        const chats = await ChatIns.findAll({
          order: [["timestamp", "DESC"]],
        });
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
    ipcMain.handle("delete-all-chats", async () => {
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
    ipcMain.handle("get-all-prompts", async () => {
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
    ipcMain.handle(
      "update-prompt",
      async (event, id: number, prompt: Prompt) => {
        try {
          const result = await PromptIns.update(
            { ...prompt },
            { where: { id: id } }
          );
          return result;
        } catch (err) {
          throw new Error("failed");
        }
      }
    );
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

    ipcMain.handle(
      "update-chat-field-by-id",
      async (event, id: number, field: keyof Chat, value: any) => {
        try {
          await ChatIns.update({ [field]: value }, { where: { id: id } });
          const updatedChat = await ChatIns.findByPk(id);
          return updatedChat.dataValues;
        } catch (err) {
          throw new Error("failed");
        }
      }
    );

    ipcMain.handle(
      "get-chat-field-by-id",
      async (event, id: number, field: keyof Chat) => {
        try {
          const result = await ChatIns.findByPk(id);
          return result.dataValues[field];
        } catch (err) {
          throw new Error("failed");
        }
      }
    );

    ipcMain.handle("get-chat-by-id", async (event, id: number) => {
      try {
        const result = await ChatIns.findByPk(id);
        return result.dataValues;
      } catch (err) {
        throw new Error("failed");
      }
    });

    ipcMain.handle(
      "update-message-field-by-id",
      async (event, id: number, field: keyof Message, value: any) => {
        try {
          await MessageIns.update({ [field]: value }, { where: { id: id } });
          const updatedMessage = await MessageIns.findByPk(id);
          return updatedMessage.dataValues;
        } catch (err) {
          throw new Error("failed");
        }
      }
    );

    ipcMain.handle("export-all-chats", async () => {
      const result = await dialog.showSaveDialog(window, {
        defaultPath: "all_chats.json",
      });
      ChatIns.findAll().then((allChat) => {
        const promises = allChat.map(async (chat) => {
          const messages = await MessageIns.findAll({
            where: {
              chatId: chat.dataValues.id,
            },
          });
          return {
            ...chat.dataValues,
            messages: messages.map((message) => message.dataValues),
          };
        });
        Promise.all(promises).then((chats) => {
          fs.writeFile(result.filePath, JSON.stringify(chats), (err) => {
            if (!err) {
              shell.showItemInFolder(result.filePath);
            }
          });
        });
      });
    });

    ipcMain.handle("export-all-prompts", async () => {
      const result = await dialog.showSaveDialog(window, {
        defaultPath: "all_prompts.json",
      });
      PromptIns.findAll().then((allPrompt) => {
        const chats = allPrompt.map((prompt) => prompt.dataValues);
        fs.writeFile(result.filePath, JSON.stringify(chats), (err) => {
          if (!err) {
            shell.showItemInFolder(result.filePath);
          }
        });
      });
    });

    ipcMain.handle("import-all-chats", async () => {
      const result = await dialog.showOpenDialog(window, {
        properties: ["openFile"],
        filters: [{ name: "JSON", extensions: ["json"] }],
      });
      if (result.canceled) return;
      try {
        const data = await readFilePromise(result.filePaths[0], "utf-8");
        const chats = JSON.parse(data);
        const promises = chats.map(
          async (chat: Chat & { messages: Message[] }) => {
            delete chat.id;
            const _messages = chat.messages;
            delete chat.messages;
            const _chat = await ChatIns.create({ ...chat });
            const messages: Message[] = _messages.map((message: Message) => {
              delete message.id;
              return { ...message, chatId: _chat.dataValues.id };
            });
            await MessageIns.bulkCreate(messages as any[]);
          }
        );
        return Promise.all(promises)
          .then(() => {
            return dialog.showMessageBox(window, {
              type: "info",
              title: "Import successful",
              message: "All chats have been successfully imported.",
            });
          })
          .catch(() => {
            dialog.showMessageBox(window, {
              type: "error",
              title: "Import failed",
              message: "Failed to import chats.",
            });
          });
      } catch (error) {
        dialog.showMessageBox(window, {
          type: "error",
          title: "Import failed",
          message: "Failed to import chats.",
        });
        return Promise.reject(new Error(error));
      }
    });

    ipcMain.handle("import-all-prompts", async () => {
      const result = await dialog.showOpenDialog(window, {
        properties: ["openFile"],
        filters: [{ name: "JSON", extensions: ["json"] }],
      });
      if (result.canceled) return;
      const filePath = result.filePaths[0];
      try {
        const data = await readFilePromise(filePath, "utf-8");
        const importedPrompts = JSON.parse(data);
        const prompts = importedPrompts.map((prompt: Prompt) => {
          delete prompt.id;
          return prompt;
        });
        PromptIns.bulkCreate(prompts)
          .then(() => {
            dialog.showMessageBox(window, {
              message: "Import successful！",
              type: "info",
            });
            return true;
          })
          .catch((error) => {
            dialog.showMessageBox(window, {
              message: "Import failed: Failed to write to the database.",
              type: "error",
            });
            return Promise.reject(new Error(error));
          });
      } catch {
        dialog.showMessageBox(window, {
          type: "error",
          title: "Import failed",
          message: "Failed to read file.",
        });
        return;
      }
    });

    ipcMain.handle(
      "update-chat-costTokens",
      async (_, id: number, costTokens: number) => {
        try {
          await ChatIns.update(
            { costTokens: costTokens },
            { where: { id: id } }
          );
          return costTokens;
        } catch (err) {
          throw new Error("failed");
        }
      }
    );

    // search messages by message.text and message.chatId
    ipcMain.handle(
      "search-messages",
      async (_, chatId: number, text: string) => {
        try {
          const result = await MessageIns.findAll({
            where: {
              text: {
                [Op.like]: `%${text}%`,
              },
              chatId: chatId,
            },
          });
          return result.map((message) => message.dataValues);
        } catch (err) {
          throw new Error("failed");
        }
      }
    );
  };

  return {
    init,
    getIns: () => sequelize,
  };
};

export const db = database();
