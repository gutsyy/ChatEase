import React, { useEffect, useMemo, useRef, useState } from "react";

import { requestApi } from "../../services/openAI/apiConfig";
import type { Message } from "../../database/models/Message";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  setTokensBoxWarningStateTo,
  updateChatsAfterCreated,
  setNewUserMessage,
} from "../../reducers/chatSlice";
import WaitingResponse from "./WaitingResponse";
import { dateToTimestamp } from "../../services/utils/DateTimestamp";
import MessageItem from "./MessageItem";
import { v4 } from "uuid";
import { ChatBottomStatusBar } from "./ChatBottomStatusBar";
import { NoMessages } from "./NoMessages";
import { ChatInputBox } from "./ChatInputBox";

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

  const messages = useAppSelector((state) => state.chat.messages);
  const chatId = useAppSelector((state) => state.chat.selectedChatId);
  // const isWaitingRes = useAppSelector((state) => state.chat.isWaitingRes);
  const chatsContainer = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (runningActionId !== actionId) {
  //     return;
  //   }
  //   if (!isPromptResponsing) {
  //     setToolbarState("toolbar");
  //     textInputRef.current.focus();
  //   }
  // }, [isPromptResponsing, runningActionId]);

  // useEffect(() => {
  //   if (focused && !isResponsing) {
  //     setToolbarState("toolbar");
  //   }
  // }, [isResponsing]);

  const messagesInPromptsNum = useMemo(
    () => messages.filter((msg) => msg.inPrompts).length,
    [messages]
  );

  return (
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
  );
};

export default Chat;
