import { BrowserWindow, ipcMain } from "electron";

export const windowIpcMain = (window: BrowserWindow) => {
  ipcMain.on("get-win-pos", (event) => {
    const pos = window.getPosition();
    event.returnValue = { x: pos[0], y: pos[1] };
  });
  ipcMain.on("set-win-pos", (event, x: number, y: number) => {
    window.setPosition(x, y);
    event.returnValue = null;
  });
};
