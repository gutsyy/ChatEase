import { Button } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { IconTrash } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export const CleanAppDataSettings = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="font-greycliff font-bold text-gray-800">
        {t("settings_cleanAppData_title")}
      </div>
      <div className="text-gray-400 font-greycliff text-xs">
        {t("settings_cleanAppData_help")}
      </div>
      <Button
        className="mt-2"
        color="red"
        variant="light"
        leftIcon={<IconTrash size={16} />}
        size="xs"
        onClick={() => {
          openConfirmModal({
            size: 500,
            title: (
              <div className="font-greycliff font-bold">
                Dangerous operation
              </div>
            ),
            children: (
              <div className="text-red-500">
                Are you sure you want to delete all data for the app? Restarting
                the app is required to complete the operation.
              </div>
            ),
            labels: { confirm: "Clean and Restart", cancel: "Cancel" },
            onConfirm: () => {
              window.electronAPI.othersIpcRenderer.cleanAppData();
            },
            confirmProps: {
              size: "xs",
              color: "red",
            },
            cancelProps: {
              size: "xs",
            },
          });
        }}
      >
        {t("settings_cleanAppData_button")}
      </Button>
    </div>
  );
};
