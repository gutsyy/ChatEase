import { ipcRenderer, IpcRendererEvent } from "electron";
import { NotificationData } from "../types";

export interface NotificationIpcRenderer {
  show: (
    callback: (event: IpcRendererEvent, data: NotificationData) => void
  ) => Electron.IpcRenderer;
}

export const notificationIpcRenderer: NotificationIpcRenderer = {
  show: (callback) => ipcRenderer.on("notification-show", callback),
};
