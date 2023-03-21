import { modals } from "@mantine/modals";
import { IconNetwork, IconKey, TablerIconsProps } from "@tabler/icons-react";
import { useState } from "react";
import GeneralSettings from "./GeneralSettings";
import ProxySettings from "./ProxySettings";

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
    // {
    //   name: "语言",
    //   onClick: () => null,
    //   icon: IconLanguage,
    //   panel: null,
    // },
  ];
  const [selected, setSelected] = useState<number>(0);

  const onSettingItemClick = (key: number) => {
    setSelected(key);
    settings[key].onClick();
  };

  return (
    <div className="flex" style={{ height: "500px" }}>
      <div className="flex flex-col w-36 h-full bg-gray-50 p-1 rounded">
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
                (selected === i ? "bg-blue-500" : "bg-gray-400")
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
      <div className="h-full w-full px-2 flex flex-1">
        {settings[selected].panel}
      </div>
    </div>
  );
};

export const openSettingsModal = () => {
  modals.open({
    title: "Settings",
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
