import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { MainPanel, SideExtend, SideNav } from "./components";
import { useEffect } from "react";
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
import { IconPrompt, IconSearch } from "@tabler/icons-react";
import { setSelectedMode } from "./reducers/app";
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

  // const dispatch = useAppDispatch();

  const searchProviderActions: SpotlightAction[] =
    window.electronAPI.databaseIpcRenderer.getAllPrompts().map((prompt) => ({
      title: prompt.name,
      describe: prompt.declare,
      onTrigger: () => {
        store.dispatch(setSelectedMode("prompt"));
        store.dispatch(setSelectedPromptId(prompt.id));
      },
      icon: <IconPrompt size={16} />,
    }));

  // const selectedMode = useAppSelector((state) => state.app.selectedMode);

  return (
    <Provider store={store}>
      <SpotlightProvider
        actions={searchProviderActions}
        searchIcon={<IconSearch size="1.2rem" />}
        searchPlaceholder="搜索Prompt..."
        shortcut="mod + K"
        nothingFoundMessage="Nothing found..."
      >
        <MantineProvider withGlobalStyles withNormalizeCSS>
          <Notifications position="top-right" />
          <ModalsProvider>
            <div className="flex w-full h-full">
              <SideNav />
              <SideExtend />
              <MainPanel />
              {/* {selectedMode === "chat" ? <Chat /> : <PromptPanel />} */}
              {/* <Chat /> */}
            </div>
          </ModalsProvider>
        </MantineProvider>
      </SpotlightProvider>
    </Provider>
  );
};
