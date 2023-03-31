import { createContext, useMemo, useRef } from "react";

import { useAppSelector } from "../../hooks/redux";
import WaitingResponse from "./WaitingResponse";
import MessageItem from "./MessageItem";
import { ChatBottomStatusBar } from "./ChatBottomStatusBar";
import { NoMessages } from "./NoMessages";
import { ChatInputBox } from "./ChatInputBox";

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
      <div className="h-full flex flex-col overflow-hidden flex-1">
        <div
          className="bg-gray-50 flex-1 px-4 py-2 overflow-auto relative chat-messages-view flex flex-col"
          ref={chatsContainer}
        >
          {messages.length === 0 && <NoMessages />}
          <div className="pb-2 flex-1">
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
