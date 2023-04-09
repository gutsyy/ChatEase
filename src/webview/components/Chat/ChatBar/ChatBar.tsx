import { useAppDispatch, useAppSelector } from "@/webview/hooks/redux";
import { setTokensBoxWarningStateToFalse } from "@/webview/reducers/chatSlice";
import { useMantineTheme, clsx } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { memo, useContext, useEffect } from "react";
import { ChatContext } from "..";
import ChatMenu from "./ChatMenu";
import ChatSettings from "./ChatSettings";
import Statistics from "./Statistics";
import CountUsage from "./CountUsage";

interface ChatStatisticsProps {
  messagesInPromptsNum: number;
}

const ChatBar = ({ messagesInPromptsNum }: ChatStatisticsProps) => {
  const dispatch = useAppDispatch();
  const warningState = useAppSelector(
    (state) => state.chat.tokensBoxWarningState
  );
  const chatId = useAppSelector((state) => state.chat.selectedChatId);
  const selectedChat = useAppSelector((state) => state.chat.selectedChat);
  const [opened, { close, open }] = useDisclosure();
  const { scrollToBottom } = useContext(ChatContext);
  const { colorScheme } = useMantineTheme();

  useEffect(() => {
    if (selectedChat && selectedChat.pinnedSetting) {
      open();
    }
  }, [selectedChat]);

  useEffect(() => {
    if (warningState) {
      setTimeout(() => {
        dispatch(setTokensBoxWarningStateToFalse());
      }, 2500);
    }
  }, [warningState]);

  const openChatSetting = () => {
    if (!warningState && !opened) {
      open();
    }
  };

  return (
    <div
      className={clsx(
        "absolute w-full bg-transparent flex gap-2 justify-center items-end bottom-2 z-50 transition-all",
        chatId === -1 ? "max-h-0 overflow-hidden" : "overflow-visible"
      )}
    >
      <ChatMenu />
      <div
        className={clsx(
          "px-3 py-1 shadow flex items-center overflow-hidden",
          warningState && "outline outline-2 outline-red-500",
          opened ? "rounded-lg" : "rounded-full hover:cursor-pointer",
          colorScheme === "dark"
            ? "bg-dark-900 text-dark-100"
            : "bg-white text-gray-900"
        )}
        style={{
          height: opened
            ? selectedChat && selectedChat.pinnedSetting
              ? selectedChat &&
                (selectedChat.pinnedSetting === "messagesLimit" ||
                  selectedChat.pinnedSetting === "temperature")
                ? "2.82rem"
                : "4.625rem"
              : "15rem"
            : warningState
            ? "2.67rem"
            : "1.67rem",
          transition: "height 0.2s ease-in-out",
        }}
        onClick={openChatSetting}
      >
        {opened ? (
          <ChatSettings chatId={chatId} onClose={close} />
        ) : (
          <Statistics
            messagesInPromptNum={messagesInPromptsNum}
            warningState={warningState}
          />
        )}
      </div>
      <CountUsage />
    </div>
  );
};

export default memo(ChatBar);
