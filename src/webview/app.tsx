import { clsx, MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { MainPanel, SideExtend, SideNav } from "./components";
import { useEffect, useState } from "react";
import { handleNotis } from "./services/utils/notis";
import store from "@/webview/store";
import { AxiosIpcRenderer } from "@/ipcBridge/renderer/axios";
import { ModalsProvider } from "@mantine/modals";
import { NotificationIpcRenderer } from "@/ipcBridge/renderer/notification";
import { V2rayIpcRenderer } from "@/ipcBridge/renderer/v2ray";
import { SettingsIpcRenderer } from "@/ipcBridge/renderer/settings";
import { DatabaseIpcRenderer } from "@/ipcBridge/renderer/database";
import { OthersIpcRenderer } from "@/ipcBridge/renderer/others";
import { SpotlightAction, SpotlightProvider } from "@mantine/spotlight";
import { IconSearch } from "@tabler/icons-react";
import { setMode } from "./reducers/appSlice";
import { setSelectedPromptId } from "./reducers/promptSlice";
import { openApiKeysSetupModal } from "./components/modals/openApiKeysSetUpModal";

import "./i18n/i18n";
import { useAppSelector } from "./hooks/redux";
import { TitleBar } from "./components/TitleBar";
import { WindowIpcRenderer } from "@/ipcBridge/renderer/window";

declare global {
  interface Window {
    electronAPI: {
      axiosIpcRenderer: AxiosIpcRenderer;
      notificationIpcRenderer: NotificationIpcRenderer;
      v2rayIpcRenderer: V2rayIpcRenderer;
      settingsIpcRenderer: SettingsIpcRenderer;
      databaseIpcRenderer: DatabaseIpcRenderer;
      othersIpcRenderer: OthersIpcRenderer;
      windowIpcRenderer: WindowIpcRenderer;
    };
  }
}

export const App = () => {
  const theme = useAppSelector((state) => state.app.theme);
  const openApiKey = useAppSelector((state) => state.settings.open_api_key);
  const fontSize = useAppSelector((state) => state.settings.fontSize);
  const colorScheme = useAppSelector((state) => state.settings.theme);

  useEffect(() => {
    window.electronAPI.notificationIpcRenderer.show((event, data) => {
      handleNotis(data);
    });

    document.getElementsByTagName("title")[0].innerText = `${
      document.getElementsByTagName("title")[0].innerText
    } v${window.electronAPI.othersIpcRenderer.getAppVersion()}`;

    document.addEventListener("click", (e) => {
      if (e.target instanceof HTMLAnchorElement) {
        e.preventDefault();
        window.electronAPI.othersIpcRenderer.openLink(e.target.href);
      }
    });
  }, []);

  useEffect(() => {
    if (!openApiKey) {
      openApiKeysSetupModal();
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (root) {
      root.style.fontSize = `${fontSize}px`;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      window.electronAPI.othersIpcRenderer.showContextMenu();
    });
    window.electronAPI.othersIpcRenderer.colorScheme(colorScheme);
  }, []);

  // const dispatch = useAppDispatch();

  const [searchProviderActions, setSearchProviderActions] = useState<
    SpotlightAction[]
  >([]);

  useEffect(() => {
    window.electronAPI.databaseIpcRenderer.getAllPrompts().then((prompts) => {
      setSearchProviderActions(
        prompts.map((prompt) => ({
          title: prompt.name,
          description: prompt.description,
          onTrigger: () => {
            store.dispatch(setMode("action"));
            store.dispatch(setSelectedPromptId(prompt.id));
          },
        })),
      );
    });
  }, []);

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme: theme,
        colors: {
          blue:
            theme === "light"
              ? [
                  "#f5f3ff",
                  "#ede9fe",
                  "#ddd6fe",
                  "#c4b5fd",
                  "#a78bfa",
                  "#8b5cf6",
                  "#7c3aed",
                  "#6d28d9",
                  "#5b21b6",
                  "#4c1d95",
                ]
              : [],
        },
      }}
    >
      {" "}
      <SpotlightProvider
        radius="md"
        actions={searchProviderActions}
        searchIcon={<IconSearch size="1.2rem" />}
        searchPlaceholder="Searching Prompt Action..."
        shortcut="mod + K"
        nothingFoundMessage="Nothing found..."
      >
        <Notifications position="top-right" />
        <ModalsProvider>
          <TitleBar />
          <div
            className={`flex w-full border-0 border-solid border-t ${theme === "light" ? "border-gray-200" : "border-dark-800"}`}
            style={{ height: "calc(100vh - 2.5rem)" }}
          >
            <SideNav />
            <SideExtend />
            <MainPanel />
          </div>
        </ModalsProvider>
      </SpotlightProvider>
    </MantineProvider>
  );
};
