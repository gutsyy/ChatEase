import { Switch } from "@mantine/core";
import { useTranslation } from "react-i18next";
import InputSetStyles from "./InputSetStyles";
import NumberInputSetStyles from "./NumberInputSetStyles";
import PasswordInputSetStyles from "./PasswordInputSetStyles";
import SettingItem, { SettingItemProps } from "./SettingItem";
import { useAppDispatch, useAppSelector } from "@/webview/hooks/redux";
import {
  setHttpProxy,
  setHttpProxyHost,
  setHttpProxyPassword,
  setHttpProxyPort,
  setHttpProxyUsername,
} from "@/webview/reducers/settingSlice";

const ProxySettings = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const httpEnable = useAppSelector((state) => state.settings.http_proxy);
  const settings: SettingItemProps[] = [
    {
      label: "Host",
      input: () => {
        const http_proxy_host = useAppSelector(
          (state) => state.settings.http_proxy_host
        );
        return (
          <InputSetStyles
            width="120px"
            defaultValue={http_proxy_host}
            onChange={(event) => {
              dispatch(setHttpProxyHost(event.currentTarget.value));
            }}
          />
        );
      },
    },
    {
      label: "Port",
      input: () => {
        const http_proxy_port = useAppSelector(
          (state) => state.settings.http_proxy_port
        );
        return (
          <NumberInputSetStyles
            width="120px"
            defaultValue={Number(http_proxy_port)}
            onChange={(value: number) => {
              dispatch(setHttpProxyPort(String(value)));
            }}
          />
        );
      },
    },
    {
      label: "Username (optional)",
      input: () => {
        const username = useAppSelector(
          (state) => state.settings.http_proxy_username
        );
        return (
          <InputSetStyles
            width="140px"
            defaultValue={username}
            onChange={(event) => {
              dispatch(setHttpProxyUsername(event.currentTarget.value));
            }}
          />
        );
      },
    },
    {
      label: "Password (optional)",
      input: () => {
        const password = useAppSelector(
          (state) => state.settings.http_proxy_password
        );
        return (
          <PasswordInputSetStyles
            width="140px"
            defaultValue={password}
            onChange={(event) => {
              dispatch(setHttpProxyPassword(event.currentTarget.value));
            }}
          />
        );
      },
    },
  ];

  return (
    <div className="w-full">
      <div className="flex items-center">
        <div
          className="mr-3 font-greycliff"
          style={{
            fontSize: "0.9rem",
            fontWeight: 600,
            fontFamily: "Greycliff CF, MiSans",
          }}
        >
          {t("settings_proxy_title")}
        </div>
        <Switch
          defaultChecked={httpEnable}
          color="green"
          size="sm"
          onLabel="ON"
          offLabel="OFF"
          onChange={(event) => {
            dispatch(setHttpProxy(event.currentTarget.checked));
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
