import { Switch } from "@mantine/core";
import { useState } from "react";
import { SettingsKey } from "../../../store/storeModel";
import InputSetStyles from "./InputSetStyles";
import NumberInputSetStyles from "./NumberInputSetStyles";
import PasswordInputSetStyles from "./PasswordInputSetStyles";
import SettingItem, { SettingItemProps } from "./SettingItem";

const settings: SettingItemProps[] = [
  {
    label: "Host",
    input: () => (
      <InputSetStyles
        width="120px"
        defaultValue={
          window.electronAPI.storeIpcRenderer.get("http_proxy_host") as string
        }
        onChange={(event) => {
          window.electronAPI.storeIpcRenderer.set(
            "http_proxy_host",
            event.target.value
          );
        }}
      />
    ),
  },
  {
    label: "Port",
    input: () => (
      <NumberInputSetStyles
        width="120px"
        defaultValue={
          window.electronAPI.storeIpcRenderer.get("http_proxy_port") as number
        }
        onChange={(value) => {
          window.electronAPI.storeIpcRenderer.set("http_proxy_port", value);
        }}
      />
    ),
  },
  {
    label: "Username (optional)",
    input: () => (
      <InputSetStyles
        width="140px"
        defaultValue={
          window.electronAPI.storeIpcRenderer.get(
            "http_proxy_username"
          ) as string
        }
        onChange={(event) => {
          window.electronAPI.storeIpcRenderer.set(
            "http_proxy_username",
            event.target.value
          );
        }}
      />
    ),
  },
  {
    label: "Password (optional)",
    input: () => (
      <PasswordInputSetStyles
        width="140px"
        defaultValue={
          window.electronAPI.storeIpcRenderer.get(
            "http_proxy_password"
          ) as string
        }
        onChange={(event) => {
          window.electronAPI.storeIpcRenderer.set(
            "http_proxy_password",
            event.target.value
          );
        }}
      />
    ),
  },
];

const ProxySettings = () => {
  const [httpProxySetting, setHttpProxySetting] = useState({
    enable: window.electronAPI.storeIpcRenderer.get("http_proxy"),
  });

  const setValue = (key: SettingsKey, val: any) => {
    return window.electronAPI.storeIpcRenderer.set(key, val);
  };

  // const onV2raySettingChange = (value: boolean) => {
  //   if (value) {
  //     window.electronAPI.v2rayIpcRenderer.start().then(() => {
  //       setValue("http_proxy", true);
  //       setValue("http_proxy_host", "127.0.0.1");
  //       setValue("http_proxy_port", "18964");
  //       setHttpProxySetting({
  //         enable: true,
  //         host: "127.0.0.1",
  //         port: "18964",
  //       });
  //     });
  //   } else {
  //     window.electronAPI.v2rayIpcRenderer.stop();
  //     setValue("http_proxy", false);
  //     setHttpProxySetting({ ...httpProxySetting, enable: false });
  //   }
  //   window.electronAPI.storeIpcRenderer.set("v2ray", value);
  // };

  return (
    <div className="text-gray-900 w-full">
      {/* <div className="mb-4">
        <div className="flex items-center">
          <div className="mr-3" style={{ fontSize: "0.9rem", fontWeight: 300 }}>
            内置代理
          </div>
          <Switch
            defaultChecked={getValue("v2ray") as boolean}
            color="green"
            size="sm"
            onLabel="ON"
            offLabel="OFF"
            onChange={(event) =>
              onV2raySettingChange(event.currentTarget.checked)
            }
          />
        </div>
        <div className="text-xs text-gray-400 mt-1">
          使用内置代理功能，会自动开启http代理
        </div>
      </div> */}
      <div className="flex items-center">
        <div className="mr-3" style={{ fontSize: "0.9rem", fontWeight: 500 }}>
          HTTP Proxy
        </div>
        <Switch
          checked={httpProxySetting.enable as boolean}
          color="green"
          size="sm"
          onLabel="ON"
          offLabel="OFF"
          onChange={(event) => {
            setHttpProxySetting({
              ...httpProxySetting,
              enable: event.currentTarget.checked,
            });
            setValue("http_proxy", event.currentTarget.checked);
          }}
        />
      </div>
      <div className="w-full flex flex-col rounded mt-1">
        {settings.map((setting, i) => (
          <SettingItem key={i} {...setting} />
        ))}
      </div>
    </div>
  );
};

export default ProxySettings;
