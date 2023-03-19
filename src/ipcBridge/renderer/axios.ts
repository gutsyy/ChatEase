import { IpcRenderer, ipcRenderer, IpcRendererEvent } from "electron";
import { PostRequest } from "../types";

export interface AxiosIpcRenderer {
  post: (p: PostRequest, id: string, stream?: boolean) => Promise<any>;
  stream: (
    callback: (event: IpcRendererEvent, data: any, requestId: string) => void
  ) => IpcRenderer;
}

export const axiosIpcRenderer: AxiosIpcRenderer = {
  post: (p, id, s) => ipcRenderer.invoke("axios-post", p, id, s),
  stream: (callback) => ipcRenderer.on("axios-stream", callback),
};
