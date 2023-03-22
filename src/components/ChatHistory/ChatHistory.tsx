import { Button, Text } from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useEffect, useRef } from "react";
import { newChat, setChats } from "../../reducers/app";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { closeAllModals, openConfirmModal } from "@mantine/modals";
import SearchingInput from "./SearchingInput";
import HistoryItem from "./HistoryItem";
import ScrollableList from "../../pureComponents/ScrollableList";
import { renderDate } from "./renderDate";
import { Chat } from "../../database/models/Chat";
import { timestampToDate } from "../../services/utils/DateTimestamp";

export const ChatHistory = () => {
  const dispatch = useAppDispatch();
  const chats = useAppSelector((state) => state.app.chats);

  const onNewChat = () => {
    dispatch(newChat());
  };

  useEffect(() => {
    dispatch(setChats(window.electronAPI.databaseIpcRenderer.getAllChats()));
  }, []);

  const historyContainerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full h-full flex justify-center p-1">
      <div className="flex flex-col justify-between w-full h-full">
        <Button
          className="w-full shadow"
          variant="gradient"
          gradient={{ from: "#ed6ea0", to: "#ec8c69", deg: 35 }}
          leftIcon={<IconPlus size={18} />}
          onClick={() => onNewChat()}
        >
          New Chat
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
                  {renderDate.render(
                    timestampToDate(props.timestamp).toLocaleDateString()
                  )}
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
              openConfirmModal({
                title: "删除所有会话",
                children: (
                  <Text color="red" size="sm">
                    确认要删除所有历史会话吗？
                  </Text>
                ),
                labels: { confirm: "删除", cancel: "取消" },
                onCancel: () => closeAllModals(),
                onConfirm: () => {
                  window.electronAPI.databaseIpcRenderer.deleteAllChats();
                  dispatch(
                    setChats(
                      window.electronAPI.databaseIpcRenderer.getAllChats()
                    )
                  );
                  dispatch(newChat());
                },
              });
            }}
          >
            Clear all chats
          </Button>
        </div>
      </div>
    </div>
  );
};
