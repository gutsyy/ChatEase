import { modals } from "@mantine/modals";
import {
  IconNetwork,
  IconKey,
  TablerIconsProps,
  IconTools,
  IconTrash,
} from "@tabler/icons-react";
import { useState } from "react";
import GeneralSettings from "./GeneralSettings";
import ProxySettings from "./ProxySettings";
import { ChatToolbarSettings } from "./ChatToolbarSettings";
import { MessageToolbarSettings } from "./MessageToolbarSettings";
import { CleanAppDataSettings } from "./CleanAppDataSettings";

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
  const settings: SettingItem[] = [
    {
      name: "General settings",
      onClick: () => null,
      icon: IconKey,
      panel: <GeneralSettings />,
    },
    {
      name: "Proxy settings",
      onClick: () => null,
      icon: IconNetwork,
      panel: <ProxySettings />,
    },
    {
      name: "Chat toolbar",
      onClick: () => null,
      icon: IconTools,
      panel: <ChatToolbarSettings />,
    },
    {
      name: "Message toolbar",
      onClick: () => null,
      icon: IconTools,
      panel: <MessageToolbarSettings />,
    },
    {
      name: "Clear App Data",
      onClick: () => null,
      icon: IconTrash,
      panel: <CleanAppDataSettings />,
    },
  ];
  const [selected, setSelected] = useState<number>(0);

  const onSettingItemClick = (key: number) => {
    setSelected(key);
    settings[key].onClick();
  };

  return (
    <div className="flex" style={{ height: "500px" }}>
      <div className="flex flex-col w-36 bg-gray-50 p-1 rounded">
        {settings.map((item, i) => (
          <div
            key={i}
            className={
              "flex w-full justify-between items-center mt-1 p-1 rounded hover:cursor-pointer " +
              (selected === i && "bg-gray-200")
            }
            onClick={() => onSettingItemClick(i)}
          >
            <div
              className={
                "p-1 rounded flex justify-center items-center bg-blue-500 " +
                (selected === i ? "bg-violet-500" : "bg-gray-400")
              }
            >
              {setIcon(item.icon)}
            </div>
            <div className="flex-1 flex items-center text-gray-500 ml-2 text-xs">
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
    title: <div className="font-greycliff font-bold">Settings</div>,
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
