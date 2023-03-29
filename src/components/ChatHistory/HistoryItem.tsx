import { Tooltip, TextInput, ActionIcon, Button, clsx } from "@mantine/core";
import { closeAllModals, openModal } from "@mantine/modals";
import { IconPencilMinus, IconTrash } from "@tabler/icons-react";
import { memo } from "react";
import { Chat } from "../../database/models/Chat";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  setChats,
  newChat,
  switchingChatSession,
} from "../../reducers/chatSlice";
import { renderDate } from "./renderDate";
import { useForm } from "@mantine/form";
import { openDeleteConfirmModal } from "../modals/customModals";
import { ModalTitle } from "../../pureComponents/ModalTitle";

const HistoryItem = memo(({ name, id }: Chat) => {
  const dispatch = useAppDispatch();
  const selectedChatId = useAppSelector((state) => state.chat.selectedChatId);

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
            "w-full py-2 rounded hover:cursor-pointer " +
            (id === selectedChatId && "text-white bg-gray-200")
          }
          onClick={() => dispatch(switchingChatSession(id))}
        >
          <div className="w-full h-full flex items-center justify-between pr-1 pl-2 whitespace-nowrap">
            <div
              className={clsx(
                "text-xs flex-1 text-ellipsis overflow-hidden text-gray-700"
              )}
              style={{ maxWidth: "170px", marginRight: "5px" }}
            >
              {name}
            </div>
            <div className="flex gap-1">
              <ActionIcon
                radius="xl"
                size="sm"
                color="violet"
                onClick={(e) => {
                  e.stopPropagation();
                  openModal({
                    title: <ModalTitle title="Set Chat Name" />,
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
                      title: <ModalTitle title="Delete Chat" />,
                      onConfirm: () => {
                        window.electronAPI.databaseIpcRenderer
                          .deleteChat(id)
                          .then(() => {
                            if (id === selectedChatId) {
                              dispatch(newChat());
                            }

                            window.electronAPI.databaseIpcRenderer
                              .getAllChats()
                              .then((chats) => {
                                dispatch(setChats(chats));
                              });
                          });
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

        window.electronAPI.databaseIpcRenderer.getAllChats().then((chats) => {
          dispatch(setChats(chats));
        });

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
        <Button
          variant="outline"
          size="xs"
          color="violet"
          onClick={() => closeAllModals()}
        >
          Cancel
        </Button>
        <Button className="ml-2" size="xs" type="submit" color="violet">
          Confirm
        </Button>
      </div>
    </form>
  );
};

export default HistoryItem;
