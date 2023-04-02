import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
  nativeTheme,
  shell,
} from "electron";
import { encode } from "gpt-3-encoder";
import { ChatGPTMessageType } from "../../services/openAI/apiConfig";
import { num_tokens_from_messages } from "../../services/openAI/numTokensFromMessages";
import fs from "fs";
import path from "path";
import { store } from "./store";

export const othersIpcMain = (window: BrowserWindow) => {
  ipcMain.on("cal-tokens", (event, str: string) => {
    event.returnValue = encode(str).length;
  });

  ipcMain.on(
    "cal-messages-tokens",
    (event, messages: ChatGPTMessageType[], single: boolean) => {
      event.returnValue = num_tokens_from_messages(messages, single);
    }
  );

  ipcMain.on("open-link", (event, str: string) => {
    shell.openExternal(str);
    event.returnValue = null;
  });

  ipcMain.on("get-app-version", (event) => {
    event.returnValue = app.getVersion();
  });

  ipcMain.handle("show-context-menu", () => {
    const template: MenuItemConstructorOptions[] = [
      { label: "Cut", role: "cut" },
      {
        label: "Copy",
        role: "copy",
      },
      {
        label: "Paste",
        role: "paste",
      },
      {
        label: "Undo",
        role: "undo",
      },
    ];
    const menu = Menu.buildFromTemplate(template);
    menu.popup({ window: window });
  });

  ipcMain.on("clean-app-data", (event) => {
    const userDataDir = app.getPath("userData");
    const dbFilePath = path.join(userDataDir, "database.db");

    store.clear();

    fs.unlink(dbFilePath, (err) => {
      if (err) {
        console.error(err);
        event.reply("delete-db-file-reply", { success: false, error: err });
      } else {
        console.log(`Database file "${dbFilePath}" has been deleted`);
        event.reply("delete-db-file-reply", { success: true });
        app.relaunch();
        app.quit();
      }
    });
  });

  ipcMain.on("color-scheme", (event, colorScheme) => {
    nativeTheme.themeSource = colorScheme;
    event.returnValue = null;
  });
};
