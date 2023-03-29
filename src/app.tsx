import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { MainPanel, SideExtend, SideNav } from "./components";
import { useEffect, useState } from "react";
import { handleNotis } from "./services/utils/notis";
import { Provider } from "react-redux";
import store from "./store";
import { AxiosIpcRenderer } from "./ipcBridge/renderer/axios";
import { ModalsProvider } from "@mantine/modals";
import { NotificationIpcRenderer } from "./ipcBridge/renderer/notification";
import { V2rayIpcRenderer } from "./ipcBridge/renderer/v2ray";
import { StoreIpcRenderer } from "./ipcBridge/renderer/store";
import { DatabaseIpcRenderer } from "./ipcBridge/renderer/database";
import { OthersIpcRenderer } from "./ipcBridge/renderer/others";
import { SpotlightAction, SpotlightProvider } from "@mantine/spotlight";
import { IconSearch } from "@tabler/icons-react";
import { setMode } from "./reducers/appSlice";
import { setSelectedPromptId } from "./reducers/promptSlice";
import { openApiKeysSetupModal } from "./components/modals/openApiKeysSetUpModal";

declare global {
  interface Window {
    electronAPI: {
      axiosIpcRenderer: AxiosIpcRenderer;
      notificationIpcRenderer: NotificationIpcRenderer;
      v2rayIpcRenderer: V2rayIpcRenderer;
      storeIpcRenderer: StoreIpcRenderer;
      databaseIpcRenderer: DatabaseIpcRenderer;
      othersIpcRenderer: OthersIpcRenderer;
    };
  }
}

export const App = () => {
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
    if (!window.electronAPI.storeIpcRenderer.get("open_api_key")) {
      openApiKeysSetupModal();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("contextmenu", (event) => {
      event.preventDefault();
      window.electronAPI.othersIpcRenderer.showContextMenu();
    });
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
        }))
      );
    });
  }, []);

  // const selectedMode = useAppSelector((state) => state.app.selectedMode);

  return (
    <Provider store={store}>
      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          colors: {
            blue: [
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
            ],
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
            <div className="flex w-full h-full">
              <SideNav />
              <SideExtend />
              <MainPanel />
            </div>
          </ModalsProvider>
        </SpotlightProvider>
      </MantineProvider>
    </Provider>
  );
};
