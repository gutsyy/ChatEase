import { ipcRenderer } from "electron";

type ReturnType = "success" | "failed";

export interface V2rayIpcRenderer {
  start: () => Promise<ReturnType>;
  stop: () => Promise<ReturnType>;
}

export const v2rayIpcRenderer: V2rayIpcRenderer = {
  start: async () => (await ipcRenderer.sendSync("v2ray-start")) as ReturnType,
  stop: async () => (await ipcRenderer.sendSync("v2ray-stop")) as ReturnType,
};
