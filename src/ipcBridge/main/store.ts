import { ipcMain } from "electron";
import Store from "electron-store";

import { defaultSettings, SettingsKey } from "../../store/storeModel";

export const store = new Store({ defaults: defaultSettings });

export const storeIpcMain = () => {
  ipcMain.on("electron-store-get", async (event, val) => {
    event.returnValue = store.get(val);
  });
  ipcMain.on("electron-store-set", async (event, key: SettingsKey, val) => {
    store.set(key, val);
  });
  ipcMain.on("electron-store-reset", (event, key: SettingsKey) => {
    store.reset(key);
  });
};
