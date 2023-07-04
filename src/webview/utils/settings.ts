import { SettingsKey, SettingsType, Settings } from "@/settings/settingsModel";

const get = (field: SettingsKey) => {
  return window.electronAPI.settingsIpcRenderer.get(field) as SettingsType<
    typeof field
  >;
};

const set = (field: SettingsKey, value: SettingsType<typeof field>) => {
  window.electronAPI.settingsIpcRenderer.set(field, value);
};

const reset = (key: SettingsKey) => {
  return window.electronAPI.settingsIpcRenderer.reset(key);
};

const getAll = (): Settings => {
  return window.electronAPI.settingsIpcRenderer.all();
};

export const appSettings = {
  get,
  set,
  reset,
  getAll,
};
