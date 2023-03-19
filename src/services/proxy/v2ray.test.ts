import { getAppRootDir } from "../utils/getAppRootDir";
import { startV2ray, stopV2ray } from "./v2ray";

test("start v2ray client", () => {
  return expect(startV2ray(getAppRootDir())).resolves.toBe("v2ray is running");
});

test("stop v2ray client", () => {
  return expect(stopV2ray()).resolves.toBe("v2ray is stopped");
});
