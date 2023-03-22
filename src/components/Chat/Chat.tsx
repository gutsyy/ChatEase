import React, { useEffect, useRef, useState } from "react";
import { Textarea, ActionIcon } from "@mantine/core";
import {
  IconMessageCircle,
  IconSend,
  IconBrandOpenai,
} from "@tabler/icons-react";

import { requestApi } from "../../services/openAI/apiConfig";
import type { Message } from "../../database/models/Message";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  setMessageTokens,
  setTokensBoxWarningStateTo,
  createChat,
  setNewUserMessage,
} from "../../reducers/app";
import ChatGPTMessage from "./ChatGPTMessage";
import UserMessage from "./UserMessage";
import WaitingResponse from "./WaitingResponse";
import Statistics from "./Statistics";
import { dateToTimestamp } from "../../services/utils/DateTimestamp";
import { RenderStopGenerationButton } from "./StopGenerationButton";

let isComposing = false;

function getFirstSentence(text: string) {
  let firstSentence = "";
  if (text) {
    const sentences = text.match(/^.+[\n,，.。?？]/g);
    if (sentences) {
      firstSentence = sentences[0].trim().slice(0, sentences[0].length - 1);
    } else {
      return text;
    }
  }
  return firstSentence;
}

const Chat = () => {
  const dispatch = useAppDispatch();

  const [message, setMessage] = React.useState("");
  const messages = useAppSelector((state) => state.app.messages);
  const chatId = useAppSelector((state) => state.app.selectedChatId);
  // const [loading, setLoading] = React.useState<boolean>(false);
  const isWaitingRes = useAppSelector((state) => state.app.isWaitingRes);
  const isResponsing = useAppSelector((state) => state.app.isResponsing);
  const promptTokens = useAppSelector(
    (state) => state.app.promptTokens + state.app.messageTokens
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    // 已发送信息和空字串不处理
    if (message.trim() === "" || isResponsing) {
      return;
    }

    // 检查是否符合tokens限制
    if (promptTokens > window.electronAPI.storeIpcRenderer.get("max_tokens")) {
      dispatch(setTokensBoxWarningStateTo("tokens_limit"));
      return;
    }

    // 判断是否为新会话
    let _chatId: number = chatId;

    if (_chatId === -1) {
      _chatId = window.electronAPI.databaseIpcRenderer.createChat({
        name: getFirstSentence(message),
        timestamp: dateToTimestamp(new Date()),
      });
      // 创建会话
      dispatch(createChat(_chatId));
    }

    // create a new message
    const newMessage: Message = {
      text: message.trim(),
      sender: "user",
      timestamp: dateToTimestamp(new Date()),
      chatId: _chatId,
      inPrompts: true,
    };

    window.electronAPI.databaseIpcRenderer.createMessage(newMessage);

    dispatch(setNewUserMessage(newMessage));
    setMessage("");
    // setLoading(true);

    // Send prompt messages
    const sendMessages: Message[] = [...messages, newMessage].filter(
      (msg) => msg.inPrompts
    );

    requestApi(_chatId, sendMessages);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    if (!isComposing && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      target.form.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  const [textAreaError, setTextAreaError] = useState<boolean>(false);

  useEffect(() => {
    if (promptTokens > window.electronAPI.storeIpcRenderer.get("max_tokens")) {
      setTextAreaError(true);
    } else {
      setTextAreaError(false);
    }
  }, [promptTokens]);

  const chatsContainer = useRef<HTMLDivElement>(null);

  return (
    <div className="h-full flex flex-col overflow-hidden flex-1">
      <div
        className="bg-gray-50 flex-1 px-4 py-2 overflow-auto relative chat-messages-view flex flex-col"
        ref={chatsContainer}
      >
        <Statistics messages={messages}></Statistics>
        {messages.length === 0 && (
          <div
            className="w-full flex justify-center items-center"
            style={{ height: "calc(100% - 37px)" }}
          >
            <div className="flex flex-col items-center">
              <IconBrandOpenai
                size={48}
                strokeWidth={1}
                className=" bg-green-600 p-1 text-white rounded-xl shadow"
              />
              <div className="mt-2 text-gray-500">
                Making things easy with OpenAI ChatGPT
              </div>
            </div>
          </div>
        )}
        <div className="pb-2 flex-1">
          {messages.map((message, i) => (
            <div key={i}>
              {message.sender === "user" ? (
                <UserMessage msg={message} index={i} />
              ) : (
                <ChatGPTMessage msg={message} index={i} />
              )}
            </div>
          ))}
          <div>
            {isWaitingRes && (
              <div key="loading">
                <WaitingResponse />
              </div>
            )}
          </div>
        </div>
        <RenderStopGenerationButton />
      </div>
      <div className="bg-gray-100 p-4 flex items-center">
        <IconMessageCircle size={20} className="mr-2" />
        <form
          className="flex items-center justify-between flex-1"
          onSubmit={handleSendMessage}
        >
          <Textarea
            error={textAreaError ? "信息超出tokens限制" : undefined}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              dispatch(setMessageTokens(event.target.value.trim()));
            }}
            onCompositionStart={() => {
              isComposing = true;
            }}
            onCompositionEnd={() => {
              isComposing = false;
            }}
            onKeyDown={(event) => {
              handleKeyDown(event);
            }}
            placeholder="Type your question here..."
            className="flex-1 mr-2"
            autosize
            minRows={1}
            maxRows={5}
          ></Textarea>
          <ActionIcon color="blue" type="submit" variant="subtle" size="sm">
            <IconSend size={16} />
          </ActionIcon>
        </form>
      </div>
    </div>
  );
};

export default Chat;
