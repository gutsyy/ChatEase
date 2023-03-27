import axios from "axios";
import { BrowserWindow, ipcMain } from "electron";
import { PostRequest } from "../types";
import t from "tunnel";
import { store } from "./store";

export const axiosIpcMain = (window: BrowserWindow) => {
  ipcMain.handle(
    "axios-post",
    async (event, data: PostRequest, id: string, stream?: boolean) => {
      if (store.get("http_proxy")) {
        const tunnel = t.httpsOverHttp({
          proxy: {
            host: store.get("http_proxy_host") as string,
            port: Number(store.get("http_proxy_port")),
          },
        });
        data.config.httpsAgent = tunnel;
      }
      try {
        if (stream) {
          data.config.responseType = "stream";
        }
        const res = await axios.post(data.url, data.body, data.config);
        if (stream && res.data) {
          res.data.on("data", (data: any) => {
            const lines = data
              .toString()
              .split("\n")
              .filter((line: string) => line.trim() !== "");
            for (const line of lines) {
              const message = line.replace(/^data: /, "");
              if (message === "[DONE]") {
                window.webContents.send("axios-stream", "DONE", id);
                return; // Stream finished
              }
              try {
                const parsed = JSON.parse(message);
                if (parsed) {
                  window.webContents.send("axios-stream", parsed, id);
                }
              } catch (error) {
                // throw new Error("Could not JSON parse stream message");
              }
            }
          });
          return "stream";
        }
        return res.data;
      } catch (error) {
        window.webContents.send("notification-show", {
          title: "请求失败",
          type: "error",
          message: error.message,
        });
        return null;
      }
    }
  );
};
