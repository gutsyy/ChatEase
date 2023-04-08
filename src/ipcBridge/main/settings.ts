import { ipcMain } from "electron";
import Store from "electron-store";

import { defaultSettings, SettingsKey } from "../../settings/settingsModel";

export const store = new Store({ defaults: defaultSettings });

export const settingsIpcMain = () => {
  ipcMain.on("electron-store-get", async (event, val) => {
    event.returnValue = store.get(val);
  });
  ipcMain.on("electron-store-set", async (event, key: SettingsKey, val) => {
    store.set(key, val);
  });
  ipcMain.on("electron-store-getall", async (event) => {
    event.returnValue = store.store;
  });
  ipcMain.on("electron-store-reset", (event, key: SettingsKey) => {
    store.reset(key);
    event.returnValue = store.get(key);
  });
};
