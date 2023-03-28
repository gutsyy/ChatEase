import { Button } from "@mantine/core";
import { openConfirmModal } from "@mantine/modals";
import { IconTrash } from "@tabler/icons-react";

export const CleanAppDataSettings = () => {
  return (
    <div>
      <div className="font-greycliff font-bold">Clean App Data</div>
      <div className="text-gray-400 font-greycliff text-sm">
        This operation will delete all your local data and application settings,
        and cannot be undone, making the application return to its initial
        state.
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
        Clean
      </Button>
    </div>
  );
};
