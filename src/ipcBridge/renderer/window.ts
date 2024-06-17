import { ipcRenderer } from "electron";

export interface WindowIpcRenderer {
  setPos: (x: number, y: number) => void;
  getPos: () => { x: number; y: number };
  setWinFull: () => void;
}

export const windowIpcRenderer: WindowIpcRenderer = {
  setPos(x: number, y: number) {
    ipcRenderer.sendSync("set-win-pos", x, y);
  },
  getPos() {
    return ipcRenderer.sendSync("get-win-pos");
  },
  setWinFull() {
    ipcRenderer.sendSync("set-win-full");
  },
};
