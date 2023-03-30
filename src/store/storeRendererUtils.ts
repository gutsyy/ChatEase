import { SettingsKey } from "./storeModel";

const get = <T>(field: SettingsKey): T => {
  return window.electronAPI.storeIpcRenderer.get(field) as T;
};

const set = (field: SettingsKey, value: any) => {
  window.electronAPI.storeIpcRenderer.set(field, value);
};

export const storeRendererUtils = {
  get,
  set,
};
