import { ActionIcon, clsx, useMantineTheme } from "@mantine/core";
import { IconSettings, IconTrash } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { Prompt } from "@/database/models/Prompt";
import { getAllPrompts, setSelectedPromptId } from "../../reducers/promptSlice";
import { openPromptFormModal } from "./modals/promptFormModal";
import { openDeleteConfirmModal } from "../modals/customModals";
import { ModalTitle } from "../../pureComponents/ModalTitle";

export const PromptListItem = (prompt: Prompt) => {
  const { colorScheme } = useMantineTheme();
  const selectedPromptId = useAppSelector(
    (state) => state.prompt.selectedPromptId
  );
  const dispatch = useAppDispatch();

  const onDelete = () => {
    openDeleteConfirmModal(
      {
        title: <ModalTitle title="Delete Action" />,
        onConfirm: () => {
          window.electronAPI.databaseIpcRenderer.deletePrompt(prompt.id);
          dispatch(getAllPrompts());
        },
      },
      prompt.name
    );
  };

  return (
    <div
      className={clsx(
        "flex px-2 py-2 justify-between items-center rounded",
        selectedPromptId === prompt.id
          ? colorScheme === "light"
            ? "bg-gray-200"
            : "bg-dark-500"
          : "hover:cursor-pointer"
      )}
      onClick={() => {
        dispatch(setSelectedPromptId(prompt.id));
      }}
    >
      <div
        className={clsx(
          "flex-1 flex items-center text-xs whitespace-nowrap text-ellipsis overflow-hidden",
          colorScheme === "light" ? "text-gray-500" : "text-dark-100"
        )}
      >
        <div style={{ fontFamily: "Greycliff CF, MiSans", fontWeight: 400 }}>
          {prompt.name}
        </div>
      </div>
      <div className="flex">
        <ActionIcon
          size="sm"
          radius="lg"
          color="gray"
          onClick={(e) => {
            e.stopPropagation();
            openPromptFormModal(prompt);
          }}
        >
          <IconSettings size={12} />
        </ActionIcon>
        <ActionIcon
          size="sm"
          radius="lg"
          color="red"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <IconTrash className="text-red-400" size={12} />
        </ActionIcon>
      </div>
    </div>
  );
};
