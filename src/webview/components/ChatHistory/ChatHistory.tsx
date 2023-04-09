import { Button, Text } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import { newChat, setChats } from "@/webview/reducers/chatSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { closeAllModals } from "@mantine/modals";
import SearchingInput from "./SearchingInput";
import HistoryItem from "./HistoryItem";
import ScrollableList from "@/webview/pureComponents/ScrollableList";
import { renderDate } from "./renderDate";
import { Chat } from "@//database/models/Chat";
import { timestampToDate } from "@/webview/services/utils/DateTimestamp";
import { openDeleteConfirmModal } from "../modals/customModals";
import { ModalTitle } from "@/webview/pureComponents/ModalTitle";
import { useTranslation } from "react-i18next";

export const ChatHistory = () => {
  const dispatch = useAppDispatch();
  const chats = useAppSelector((state) => state.chat.chats);
  const historyContainerRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

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
    <div className="w-full h-full flex justify-center p-1">
      <div className="flex flex-col justify-between w-full h-full">
        <Button
          styles={{
            root: {
              fontFamily: "Greycliff CF, MiSans",
              fontWeight: 700,
            },
          }}
          className="w-full"
          variant="gradient"
          gradient={{ from: "#7335ff", to: "#bf5ad9", deg: 35 }}
          leftIcon={<IconPlus size={18} />}
          onClick={() => onNewChat()}
        >
          {t("sideExtend_chat_newChat")}
        </Button>
        <SearchingInput />
        <div
          className="w-full flex-1 overflow-y-visible overflow-x-hidden my-2 mt-2"
          ref={historyContainerRef}
        >
          {historyContainerRef.current ? (
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
          ) : null}
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
