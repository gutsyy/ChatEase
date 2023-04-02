import { Button } from "@mantine/core";
import { IconFileExport, IconFileImport } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { setChats } from "../../../reducers/chatSlice";
import { useAppDispatch } from "../../../hooks/redux";
import { setPrompts } from "../../../reducers/promptSlice";

export const DataExport = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <div>
      <div className="text-sm font-greycliff font-bold">
        {t("settings_data_export")}
      </div>
      <div className="text-xs mt-1">{t("settings_data_chat_export")}</div>
      <div className="flex gap-4 mt-2">
        <Button
          className="h-7"
          leftIcon={<IconFileExport size={12} />}
          size="xs"
          color="violet"
          onClick={() =>
            window.electronAPI.databaseIpcRenderer.exportAllChats()
          }
        >
          {t("export")}
        </Button>
        <Button
          className="h-7"
          size="xs"
          color="indigo"
          leftIcon={<IconFileImport size={12} />}
          onClick={() =>
            window.electronAPI.databaseIpcRenderer.importAllChats().then(() => {
              window.electronAPI.databaseIpcRenderer
                .getAllChats()
                .then((chats) => {
                  dispatch(setChats(chats));
                });
            })
          }
        >
          {t("import")}
        </Button>
      </div>
      <div className="text-xs mt-2">{t("settings_data_prompt_export")}</div>
      <div className="flex gap-4 mt-2">
        <Button
          className="h-7"
          size="xs"
          color="violet"
          leftIcon={<IconFileExport size={12} />}
          onClick={() =>
            window.electronAPI.databaseIpcRenderer.exportAllPrompts()
          }
        >
          {t("export")}
        </Button>
        <Button
          className="h-7"
          size="xs"
          color="indigo"
          leftIcon={<IconFileImport size={12} />}
          onClick={() =>
            window.electronAPI.databaseIpcRenderer
              .importAllPrompts()
              .then(() => {
                window.electronAPI.databaseIpcRenderer
                  .getAllPrompts()
                  .then((prompts) => {
                    dispatch(setPrompts(prompts));
                  });
              })
          }
        >
          {t("import")}
        </Button>
      </div>
    </div>
  );
};
