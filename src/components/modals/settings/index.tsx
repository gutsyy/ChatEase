import { modals } from "@mantine/modals";
import {
  IconNetwork,
  IconKey,
  TablerIconsProps,
  IconTools,
  IconTrash,
  IconFileExport,
  IconMoonStars,
} from "@tabler/icons-react";
import { useState } from "react";
import GeneralSettings from "./GeneralSettings";
import ProxySettings from "./ProxySettings";
import { ChatToolbarSettings } from "./ChatToolbarSettings";
import { MessageToolbarSettings } from "./MessageToolbarSettings";
import { CleanAppDataSettings } from "./CleanAppDataSettings";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { clsx, useMantineTheme } from "@mantine/core";
import { DataExport } from "./DataExportSettings";
import AppearanceSettings from "./AppearanceSettings";

type SettingItem = {
  name: string;
  icon: (props: TablerIconsProps) => JSX.Element;
  onClick: () => void;
  panel: React.ReactNode;
};

const setIcon = (Component: (props: TablerIconsProps) => JSX.Element) => {
  return <Component className="text-white" size={14} />;
};

const Settings = () => {
  const [selected, setSelected] = useState<number>(0);
  const { t } = useTranslation();
  const { colorScheme } = useMantineTheme();

  const settings: SettingItem[] = [
    {
      name: t("settings_general_title"),
      onClick: () => null,
      icon: IconKey,
      panel: <GeneralSettings />,
    },
    {
      name: t("settings_appearance_title"),
      onClick: () => null,
      icon: IconMoonStars,
      panel: <AppearanceSettings />,
    },
    {
      name: t("settings_proxy_title"),
      onClick: () => null,
      icon: IconNetwork,
      panel: <ProxySettings />,
    },
    {
      name: t("settings_chatToolbar_title"),
      onClick: () => null,
      icon: IconTools,
      panel: <ChatToolbarSettings />,
    },
    {
      name: t("settings_message_title"),
      onClick: () => null,
      icon: IconTools,
      panel: <MessageToolbarSettings />,
    },
    {
      name: t("settings_data_export"),
      onClick: () => null,
      icon: IconFileExport,
      panel: <DataExport />,
    },
    {
      name: t("settings_cleanAppData_title"),
      onClick: () => null,
      icon: IconTrash,
      panel: <CleanAppDataSettings />,
    },
  ];

  const onSettingItemClick = (key: number) => {
    setSelected(key);
    settings[key].onClick();
  };

  return (
    <div className="flex" style={{ height: "500px" }}>
      <div
        className={clsx(
          "flex flex-col w-36 p-1 rounded",
          colorScheme === "dark" ? "bg-dark-700" : "bg-gray-50"
        )}
      >
        {settings.map((item, i) => (
          <div
            key={i}
            className={
              "flex w-full justify-between items-center mt-1 p-1 rounded hover:cursor-pointer " +
              (selected === i &&
                (colorScheme === "dark" ? "bg-dark-500" : "bg-gray-200"))
            }
            onClick={() => onSettingItemClick(i)}
          >
            <div
              className={clsx(
                "p-1 rounded flex justify-center items-center bg-blue-500",
                colorScheme !== "dark"
                  ? selected === i
                    ? "bg-violet-500"
                    : "bg-gray-400"
                  : selected === i
                  ? "bg-violet-500"
                  : "bg-dark-500"
              )}
            >
              {setIcon(item.icon)}
            </div>
            <div className="flex-1 flex items-center ml-2 text-xs">
              {item.name}
            </div>
          </div>
        ))}
      </div>
      <div className="px-2 flex flex-1">{settings[selected].panel}</div>
    </div>
  );
};

export const openSettingsModal = () => {
  modals.open({
    title: (
      <div className="font-greycliff font-bold font-gray-800">
        {t("settings_modal_name")}
      </div>
    ),
    styles: {
      header: {
        padding: "0.5rem",
        paddingBottom: "0.3rem",
        paddingLeft: "0.75rem",
      },
      body: {
        padding: "0.5rem",
      },
    },
    centered: true,
    closeOnClickOutside: false,
    size: 800,
    children: <Settings />,
  });
};
