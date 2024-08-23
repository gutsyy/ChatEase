import { BrowserWindow, ipcMain, screen } from "electron";

const fullState = {
  isFull: false,
  prevX: 0,
  prevY: 0,
  prevWidth: 0,
  prevHeight: 0,
};

export const windowIpcMain = (window: BrowserWindow) => {
  ipcMain.on("get-win-pos", (event) => {
    const pos = window.getPosition();
    event.returnValue = { x: pos[0], y: pos[1] };
  });
  ipcMain.on("set-win-pos", (event, x: number, y: number) => {
    window.setPosition(x, y);
    event.returnValue = null;
  });
  ipcMain.on("set-win-full", (event) => {
    if (fullState.isFull) {
      fullState.isFull = false;
      window.setPosition(fullState.prevX, fullState.prevY, true);
      window.setSize(fullState.prevWidth, fullState.prevHeight, true);
      event.returnValue = null;
      return;
    }

    // store prev window states
    fullState.isFull = true;
    fullState.prevX = window.getPosition()[0];
    fullState.prevY = window.getPosition()[1];
    fullState.prevWidth = window.getBounds().width;
    fullState.prevHeight = window.getBounds().height;

    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    window.setPosition(0, 0, true);
    window.setSize(width, height, true);
    event.returnValue = null;
  });
};
