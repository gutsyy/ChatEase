import { ipcRenderer } from "electron";
import { ChatGPTMessageType } from "../../services/openAI/apiConfig";

export interface OthersIpcRenderer {
  calTokens: (str: string) => number;
  calMessagesTokens: (
    messages: ChatGPTMessageType[],
    single?: boolean
  ) => number;
  openLink: (url: string) => void;
  getAppVersion: () => string;
  removeAllListeners: (channel: string) => void;
  showContextMenu: () => void;
  cleanAppData: () => void;
}

export const othersIpcRenderer: OthersIpcRenderer = {
  calTokens: (str) => {
    return ipcRenderer.sendSync("cal-tokens", str) as number;
  },
  calMessagesTokens: (messages: ChatGPTMessageType[], single = false) => {
    return ipcRenderer.sendSync(
      "cal-messages-tokens",
      messages,
      single
    ) as number;
  },
  openLink: (url) => {
    ipcRenderer.sendSync("open-link", url);
  },
  getAppVersion: () => {
    return ipcRenderer.sendSync("get-app-version");
  },
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
  showContextMenu: () => {
    ipcRenderer.invoke("show-context-menu");
  },
  cleanAppData: () => {
    ipcRenderer.sendSync("clean-app-data");
  },
};
