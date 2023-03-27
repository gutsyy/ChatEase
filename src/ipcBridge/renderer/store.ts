import { ipcRenderer } from "electron";
import { SettingsKey } from "../../store/storeModel";

type GetReturnType = string | number | boolean | number[];

export interface StoreIpcRenderer {
  set: (key: SettingsKey, val: any) => void;
  get: (key: SettingsKey) => GetReturnType;
  reset: (key: SettingsKey) => void;
}

export const storeIpcRenderer: StoreIpcRenderer = {
  get(key) {
    return ipcRenderer.sendSync("electron-store-get", key) as GetReturnType;
  },
  set(key, val) {
    ipcRenderer.send("electron-store-set", key, val);
  },
  reset(key) {
    ipcRenderer.send("electron-store-reset", key);
  },
};
