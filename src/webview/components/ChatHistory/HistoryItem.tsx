import {
  TextInput,
  ActionIcon,
  Button,
  clsx,
  useMantineTheme,
} from "@mantine/core";
import { closeAllModals, openModal } from "@mantine/modals";
import { IconPencilMinus, IconTrash } from "@tabler/icons-react";
import { memo } from "react";
import { Chat } from "@/database/models/Chat";
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
import { TooltipSetStyles } from "../../pureComponents/TooltipSetStyles";
import { useTranslation } from "react-i18next";

const HistoryItem = memo(({ name, id }: Chat) => {
  const dispatch = useAppDispatch();
  const selectedChatId = useAppSelector((state) => state.chat.selectedChatId);
  const { t } = useTranslation();
  const { colorScheme } = useMantineTheme();

  return (
    <>
      <TooltipSetStyles
        maw={300}
        label={name}
        multiline
        position="right"
        openDelay={1000}
      >
        <div
          className={clsx(
            "w-full py-2 hover:cursor-pointer px-1",
            id !== selectedChatId && colorScheme === "light" && "text-gray-600",
            id !== selectedChatId && colorScheme === "dark" && "text-dark-300",
            id === selectedChatId &&
              colorScheme === "light" &&
              "bg-gray-200 text-gray-700",
            id === selectedChatId &&
              colorScheme === "dark" &&
              "bg-dark-500 text-white"
          )}
          onClick={() => dispatch(switchingChatSession(id))}
        >
          <div className="w-full h-full flex items-center justify-between pr-1 pl-2 whitespace-nowrap">
            <div
              className={clsx("text-xs flex-1 text-ellipsis overflow-hidden")}
              style={{ marginRight: "5px" }}
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
                    title: (
                      <ModalTitle title={t("sideExtent_chat_edit_title")} />
                    ),
                    children: <ChatNameEditForm name={name} id={id} />,
                  });
                }}
              >
                <IconPencilMinus
                  className={
                    colorScheme === "dark" ? "text-dark-100" : "text-violet-500"
                  }
                  size={12}
                />
              </ActionIcon>
              <ActionIcon
                radius="xl"
                size="sm"
                color="red"
                onClick={(event) => {
                  event.stopPropagation();
                  openDeleteConfirmModal(
                    {
                      title: (
                        <ModalTitle title={t("sideExtend_chat_delete_title")} />
                      ),
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
                <IconTrash className="text-red-400" size={12} />
              </ActionIcon>
            </div>
          </div>
        </div>
      </TooltipSetStyles>
    </>
  );
});

const ChatNameEditForm = (chat: Chat) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
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
        label={t("sideExtent_chat_edit_chatName_label")}
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
          {t("cancel")}
        </Button>
        <Button className="ml-2" size="xs" type="submit" color="violet">
          {t("confirm")}
        </Button>
      </div>
    </form>
  );
};

export default HistoryItem;
