import { Tooltip, TextInput, ActionIcon, Text, Button } from "@mantine/core";
import { closeAllModals, openConfirmModal, openModal } from "@mantine/modals";
import { IconPencilMinus, IconTrash } from "@tabler/icons-react";
import { memo } from "react";
import { Chat } from "../../database/models/Chat";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { selectedChatChange, setChats, newChat } from "../../reducers/app";
import { renderDate } from "./renderDate";
import { useForm } from "@mantine/form";
import { openDeleteConfirmModal } from "../modals/customModals";

const ChatNameEditForm = (chat: Chat) => {
  const dispatch = useAppDispatch();

  const form = useForm({
    initialValues: {
      name: chat ? chat.name : "",
    },
    validate: {
      name: (value: string) => (value.trim() ? null : "Please enter a name"),
    },
  });

  return (
    <form
      onSubmit={form.onSubmit((values) => {
        window.electronAPI.databaseIpcRenderer.updateChatName(
          chat.id,
          values.name
        );
        dispatch(
          setChats(window.electronAPI.databaseIpcRenderer.getAllChats())
        );
        renderDate.date = "";
        closeAllModals();
      })}
    >
      <TextInput
        size="xs"
        variant="filled"
        label="Chat's Name"
        withAsterisk
        {...form.getInputProps("name")}
      ></TextInput>
      <div className="flex justify-end items-center mt-4">
        <Button variant="outline" size="xs" onClick={() => closeAllModals()}>
          Cancel
        </Button>
        <Button className="ml-2" size="xs" type="submit">
          Confirm
        </Button>
      </div>
    </form>
  );
};

const HistoryItem = memo(({ name, id }: Chat) => {
  const dispatch = useAppDispatch();

  const selectedChatId = useAppSelector((state) => state.app.selectedChatId);

  return (
    <>
      <Tooltip
        styles={{
          tooltip: {
            fontSize: "12px",
            maxWidth: "300px",
          },
        }}
        label={name}
        withArrow
        multiline
        position="right"
        openDelay={1000}
      >
        <div
          className={
            "w-full py-2 rounded-md hover:cursor-pointer " +
            (id === selectedChatId && "shadow text-white bg-white")
          }
          onClick={() => dispatch(selectedChatChange(id))}
        >
          <div className="w-full h-full flex items-center pl-2 whitespace-nowrap">
            <div
              className="text-xs text-gray-700 flex-1 text-ellipsis overflow-hidden"
              style={{ maxWidth: "170px", marginRight: "5px" }}
            >
              {name}
            </div>
            <div className="flex gap-1">
              <ActionIcon
                radius="xl"
                size="sm"
                color="blue"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal({
                    title: "Set Chat's Name",
                    children: <ChatNameEditForm name={name} id={id} />,
                  });
                }}
              >
                <IconPencilMinus size={12} />
              </ActionIcon>
              <ActionIcon
                radius="xl"
                size="sm"
                color="red"
                onClick={(event) => {
                  event.stopPropagation();
                  openDeleteConfirmModal(
                    {
                      title: "Delete Chat",
                      onConfirm: () => {
                        window.electronAPI.databaseIpcRenderer.deleteChat(id);
                        if (id === selectedChatId) {
                          dispatch(newChat());
                        }
                        dispatch(
                          setChats(
                            window.electronAPI.databaseIpcRenderer.getAllChats()
                          )
                        );
                      },
                    },
                    name
                  );
                }}
              >
                <IconTrash size={12} />
              </ActionIcon>
            </div>
          </div>
        </div>
      </Tooltip>
    </>
  );
});

export default HistoryItem;
