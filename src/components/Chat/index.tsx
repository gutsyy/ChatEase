import { createContext, useEffect, useMemo, useRef, useState } from "react";

import { useAppSelector } from "../../hooks/redux";
import WaitingResponse from "./WaitingResponse";
import MessageItem from "./MessageItem";
import { ChatBottomStatusBar } from "./ChatBottomStatusBar";
import { NoMessages } from "./NoMessages";
import { ChatInputBox } from "./ChatInputBox";
import { clsx, useMantineTheme } from "@mantine/core";
import html2canvas from "html2canvas";
import { ShareImageDialog } from "./ShareImageDialog";
import { PinnedMessages } from "./PinnedMessages";

export const ChatContext = createContext<{
  scrollToBottom: () => void;
} | null>(null);

export default function Chat() {
  const messages = useAppSelector((state) => state.chat.messages);
  const chatId = useAppSelector((state) => state.chat.selectedChatId);
  const chatsContainer = useRef<HTMLDivElement>(null);
  const messagesInPromptsNum = useMemo(
    () => messages.filter((msg) => msg.inPrompts).length,
    [messages]
  );
  const { colorScheme } = useMantineTheme();
  const messagesContainer = useRef<HTMLDivElement>(null);
  const shareMessages = useAppSelector((state) => state.chat.shareImageDialog);
  const [imageCanvas, setImageCanvas] = useState<HTMLCanvasElement | null>(
    null
  );

  useEffect(() => {
    if (messagesContainer.current && shareMessages) {
      html2canvas(messagesContainer.current as HTMLElement).then((canvas) => {
        setImageCanvas(canvas);
      });
    }
    if (!shareMessages) {
      setImageCanvas(null);
    }
  }, [shareMessages]);

  const scrollToBottom = () => {
    if (chatsContainer.current) {
      chatsContainer.current.scrollTo({
        top: chatsContainer.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <ChatContext.Provider value={{ scrollToBottom }}>
      <ShareImageDialog canvas={imageCanvas} />
      <div className="h-full flex flex-col overflow-hidden flex-1">
        <div
          className={clsx(
            "flex-1 relative h-full w-full",
            colorScheme === "dark" && "bg-dark-800 scrollbar-custom-dark",
            colorScheme === "light" && "bg-gray-50 scrollbar-custom"
          )}
          ref={chatsContainer}
        >
          <PinnedMessages messages={messages} />
          {messages.length === 0 && <NoMessages />}
          <div
            className={clsx(
              "pb-4 pt-2 flex-1 px-4 absolute top-1 bottom-0 w-full overflow-y-scroll",
              colorScheme === "dark" && "bg-dark-800",
              colorScheme === "light" && "bg-gray-50"
            )}
            ref={messagesContainer}
          >
            {messages.map((message, i) => (
              <div key={message.id}>
                <MessageItem msg={message} index={i} />
              </div>
            ))}
            <WaitingResponse />
          </div>
          <ChatBottomStatusBar messagesInPromptsNum={messagesInPromptsNum} />
        </div>
        <ChatInputBox messages={messages} chatId={chatId} />
      </div>
    </ChatContext.Provider>
  );
}
