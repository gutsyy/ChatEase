import { exec, spawn } from "child_process";

// start v2ray
export const startV2ray = (appRootDir: string) => {
  return new Promise((resolve, reject) => {
    // v2ray tools path
    const v2rayPath = appRootDir + "/proxy/v2ray-macos-64/v2ray";
    // v2ray configuration file path
    const v2rayConfigPath = appRootDir + "/proxy/config.json";

    // kill process which on port 18964

    // check platform
    if (process.platform === "darwin") {
      const childProcess = spawn(v2rayPath, ["run", "-c", v2rayConfigPath], {
        detached: true,
        stdio: "ignore",
      });
      childProcess.unref();

      resolve("v2ray is running");
    } else {
      reject(new Error("Your OS not support v2ray"));
    }
  });
};

// stop v2ray
export const stopV2ray = () => {
  return new Promise((resolve, reject) => {
    if (process.platform === "darwin") {
      exec(`killall v2ray`, (error) => {
        if (error) {
          reject(error);
        }
        resolve("v2ray is stopped");
      });
    }
  });
};
