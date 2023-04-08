// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge } from "electron";
import { axiosIpcRenderer } from "./ipcBridge/renderer/axios";
import { notificationIpcRenderer } from "./ipcBridge/renderer/notification";
import { SettingsIpcRenderer } from "./ipcBridge/renderer/settings";
import { v2rayIpcRenderer } from "./ipcBridge/renderer/v2ray";
import { databaseIpcRenderer } from "./ipcBridge/renderer/database";
import { othersIpcRenderer } from "./ipcBridge/renderer/others";

contextBridge.exposeInMainWorld("electronAPI", {
  axiosIpcRenderer,
  notificationIpcRenderer,
  settingsIpcRenderer: SettingsIpcRenderer,
  v2rayIpcRenderer,
  databaseIpcRenderer,
  othersIpcRenderer,
});
