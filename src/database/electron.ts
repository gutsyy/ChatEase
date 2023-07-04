import { app, BrowserWindow, dialog, ipcMain, shell } from "electron";
import { Sequelize } from "sequelize";
import sqlite3, { Database } from "sqlite3";
import { initialPrompts } from "./initialDatas";
import { Chat, createChatIns } from "./models/Chat";
import { createMessageIns, Message } from "./models/Message";
import { createPromptIns, Prompt } from "./models/Prompt";
import {
  camelToHyphen,
  catchError,
  syncOrCreateTableAndBulkCreateInitialDatas,
} from "./utils";
import fs from "fs";
import { promisify } from "util";
import { createMessageRepo } from "./repository/messageRepo";
import { createChatRepo } from "./repository/chatRepo";
import { createPromptRepo } from "./repository/PromptRepo";

const readFilePromise = promisify(fs.readFile);

function database() {
  let sequelize: Sequelize | null = null;

  const init = async (window: BrowserWindow) => {
    const sqlitePath = app.getPath("userData") + "/database.db";
    new Database(sqlitePath);
    sequelize = new Sequelize({
      dialect: "sqlite",
      dialectModule: sqlite3,
      storage: sqlitePath,
    });

    const MessageIns = createMessageIns(sequelize);
    MessageIns.sync();
    const ChatIns = createChatIns(sequelize);
    ChatIns.sync();
    const PromptIns = createPromptIns(sequelize);
    PromptIns.sync();

    // write initial datas
    await syncOrCreateTableAndBulkCreateInitialDatas(
      sequelize,
      PromptIns,
      initialPrompts
    );

    // create ipc handlers by repos
    Object.entries({
      ...createMessageRepo(MessageIns),
      ...createChatRepo(ChatIns, MessageIns, sequelize),
      ...createPromptRepo(PromptIns),
    }).forEach(([key, value]) => {
      ipcMain.handle(camelToHyphen(key), async (event, ...args: any) =>
        catchError(value, ...args)
      );
    });

    // import / export
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
  };

  return {
    init,
    getIns: () => sequelize,
  };
}

export const db = database();
