import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
  nativeTheme,
  shell,
} from "electron";
import { ChatGPTMessageType } from "@/webview/services/openAI/apiConfig";
import { encode } from "gpt-3-encoder";
import { num_tokens_from_messages } from "./utils/numTokensFromMessages";
import { db } from "../../database/electron";

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

  ipcMain.on("clean-app-data", () => {
    // store.clear();
    db.getIns()
      .drop()
      .then(() => {
        app.relaunch();
        app.quit();
      });
  });

  ipcMain.on("color-scheme", (event, colorScheme) => {
    nativeTheme.themeSource = colorScheme;
    event.returnValue = null;
  });
};
