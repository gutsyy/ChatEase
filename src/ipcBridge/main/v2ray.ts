import { app, ipcMain } from "electron";
import { stopV2ray, startV2ray } from "../../services/proxy/v2ray";

export const v2rayIpcMain = () => {
  ipcMain.on("v2ray-start", (event) => {
    startV2ray(app.getAppPath())
      .then(() => {
        event.returnValue = "success";
        // event.reply("notification-show", {
        //   title: "代理设置启动成功",
        //   type: "success",
        //   message: "",
        // });
      })
      .catch((error) => {
        event.returnValue = "failed";
        event.reply("notification-show", {
          title: "内置代理启动失败",
          type: "error",
          message: error.message,
        });
      });
  });

  ipcMain.on("v2ray-stop", (event) => {
    stopV2ray().then(() => {
      event.returnValue = "success";
      // event.reply("notification-show", {
      //   title: "代理设置已关闭",
      //   type: "success",
      //   message: "",
      // });
    });
  });
};
