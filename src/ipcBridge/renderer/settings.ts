import { ipcRenderer } from "electron";
import {
  SettingsKey,
  SettingsType,
  Settings,
} from "../../settings/settingsModel";

export interface SettingsIpcRenderer {
  set: (key: SettingsKey, val: SettingsType<typeof key>) => void;
  get: (key: SettingsKey) => SettingsType<typeof key>;
  reset: (key: SettingsKey) => SettingsType<typeof key>;
  all: () => Settings;
}

export const SettingsIpcRenderer: SettingsIpcRenderer = {
  get(key) {
    return ipcRenderer.sendSync("electron-store-get", key);
  },
  set(key, val) {
    ipcRenderer.send("electron-store-set", key, val);
  },
  reset(key) {
    return ipcRenderer.sendSync("electron-store-reset", key);
  },
  all() {
    return ipcRenderer.sendSync("electron-store-getall");
  },
};
