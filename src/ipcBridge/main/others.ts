import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItemConstructorOptions,
  shell,
} from "electron";
import { encode } from "gpt-3-encoder";
import { ChatGPTMessageType } from "../../services/openAI/apiConfig";
import { num_tokens_from_messages } from "../../services/openAI/numTokensFromMessages";

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
};
