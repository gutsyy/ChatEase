import { ActionIcon, clsx } from "@mantine/core";
import { IconSettings, IconTrash } from "@tabler/icons-react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { Prompt } from "../../database/models/Prompt";
import { getAllPrompts, setSelectedPromptId } from "../../reducers/promptSlice";
import { openPromptFormModal } from "./modals/promptFormModal";
import { openDeleteConfirmModal } from "../modals/customModals";

export const PromptListItem = (prompt: Prompt) => {
  const selectedPromptId = useAppSelector(
    (state) => state.prompt.selectedPromptId
  );
  const dispatch = useAppDispatch();

  const onDelete = () => {
    openDeleteConfirmModal(
      {
        title: "Delete Prompt",
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
        selectedPromptId === prompt.id ? "bg-gray-200" : "hover:cursor-pointer"
      )}
      onClick={() => {
        dispatch(setSelectedPromptId(prompt.id));
      }}
    >
      <div className="flex-1 flex items-center text-xs text-gray-500 whitespace-nowrap text-ellipsis overflow-hidden">
        <div
          style={{ fontFamily: "Greycliff CF, sans serif", fontWeight: 400 }}
        >
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
          <IconTrash size={12} />
        </ActionIcon>
      </div>
    </div>
  );
};
