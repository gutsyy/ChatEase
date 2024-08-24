import { Button, Text, clsx, useMantineTheme } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import { newChat, setChats } from "@/webview/reducers/chatSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { closeAllModals } from "@mantine/modals";
import SearchingInput from "./SearchingInput";
import HistoryItem from "./HistoryItem";
import ScrollableList from "@/webview/pureComponents/ScrollableList";
import { renderDate } from "./renderDate";
import { Chat } from "@/database/models/Chat";
import { timestampToDate } from "@/webview/services/utils/DateTimestamp";
import { openDeleteConfirmModal } from "../modals/customModals";
import { ModalTitle } from "@/webview/pureComponents/ModalTitle";
import { useTranslation } from "react-i18next";

export const ChatHistory = () => {
  const dispatch = useAppDispatch();
  const chats = useAppSelector((state) => state.chat.chats);
  const historyContainerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();
  const { colorScheme } = useMantineTheme();

  useEffect(() => {
    window.electronAPI.databaseIpcRenderer.getAllChats().then((chats) => {
      dispatch(setChats(chats));
    });
  }, []);

  const onNewChat = () => {
    dispatch(newChat());
  };

  const handleClearAllHistory = () => {
    openDeleteConfirmModal(
      {
        title: <ModalTitle title="Clear All Chat History" />,
        children: (
          <Text color="red" size="sm">
            Are you sure you want to delete all chat history? This action is
            irreversible.
          </Text>
        ),
        onCancel: () => closeAllModals(),
        onConfirm: () => {
          window.electronAPI.databaseIpcRenderer.deleteAllChats();
          window.electronAPI.databaseIpcRenderer.getAllChats().then((chats) => {
            dispatch(setChats(chats));
          });
          dispatch(newChat());
        },
      },
      ""
    );
  };

  useEffect(() => {
    renderDate.date = "";
  }, [chats]);

  const { render: RenderDate } = renderDate;

  return (
    <div className="w-full h-full flex justify-center py-1">
      <div className="flex flex-col justify-between w-full h-full">
        <div
          className={clsx(
            "flex items-center gap-1 px-1 pb-2 border-solid border-0 border-b",
            colorScheme === "dark" ? "border-dark-600" : "border-gray-200"
          )}
        >
          <div className="flex-1">
            <SearchingInput />
          </div>
          <div
            className="h-7 w-7 bg-violet-600 flex items-center justify-center rounded-full text-white hover:cursor-pointer hover:bg-violet-500"
            onClick={() => onNewChat()}
          >
            <IconPlus size="1rem" />
          </div>
        </div>
        <div
          className="w-full flex-1 overflow-y-visible overflow-x-hidden my-2 mt-2"
          ref={historyContainerRef}
        >
          {historyContainerRef.current && chats.length ? (
            <ScrollableList
              dataList={chats}
              itemHeight={38}
              containerRef={historyContainerRef}
              renderItem={(props: Chat) => (
                <>
                  <RenderDate
                    d={timestampToDate(props.timestamp).toLocaleDateString()}
                  />
                  <HistoryItem {...props} />
                </>
              )}
            />
          ) : (
            <div
              className={clsx(
                "w-full flex justify-center font-greycliff text-sm h-full items-center pb-36",
                colorScheme === "dark" ? "text-gray-500" : "text-gray-400"
              )}
            >
              {t("chat_history_noData")}
            </div>
          )}
        </div>
        <div>
          <Button
            variant="subtle"
            color="gray"
            className="w-full"
            size="xs"
            leftIcon={<IconTrash size={14} />}
            onClick={() => {
              handleClearAllHistory();
            }}
          >
            {t("sideExtend_chat_clear")}
          </Button>
        </div>
      </div>
    </div>
  );
};
