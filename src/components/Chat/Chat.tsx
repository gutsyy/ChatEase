import React, { useEffect, useRef, useState } from "react";
import { Textarea, ActionIcon, Button, clsx } from "@mantine/core";
import {
  IconMessageCircle,
  IconSend,
  IconBrandOpenai,
  IconArrowBackUp,
  IconX,
} from "@tabler/icons-react";

import { requestApi, requestPromptApi } from "../../services/openAI/apiConfig";
import type { Message } from "../../database/models/Message";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  setMessageTokens,
  setTokensBoxWarningStateTo,
  updateChatsAfterCreated,
  setNewUserMessage,
} from "../../reducers/chatSlice";
import WaitingResponse from "./WaitingResponse";
import Statistics from "./Statistics";
import { dateToTimestamp } from "../../services/utils/DateTimestamp";
import { RenderStopGenerationButton } from "./StopGenerationButton";
import MessageItem from "./MessageItem";
import { Prompt } from "../../database/models/Prompt";
import { useFocusWithin } from "@mantine/hooks";
import { setActionId, setPromptIsResponsing } from "../../reducers/promptSlice";
import { v4 } from "uuid";

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

let historyMessage = "";

const Chat = () => {
  const dispatch = useAppDispatch();

  const [message, setMessage] = React.useState("");
  const messages = useAppSelector((state) => state.chat.messages);
  const chatId = useAppSelector((state) => state.chat.selectedChatId);
  const isWaitingRes = useAppSelector((state) => state.chat.isWaitingRes);
  const isResponsing = useAppSelector((state) => state.chat.isResponsing);
  const promptTokens = useAppSelector(
    (state) => state.chat.totalPromptTokens + state.chat.inputBoxTokens
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    setToolbarState("");

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
      _chatId = await window.electronAPI.databaseIpcRenderer.createChat({
        name: getFirstSentence(message),
        timestamp: dateToTimestamp(new Date()),
      });
      // 创建会话
      dispatch(updateChatsAfterCreated(_chatId));
    }

    // create a new message
    const newMessage: Message = {
      text: message.trim(),
      sender: "user",
      timestamp: dateToTimestamp(new Date()),
      chatId: _chatId,
      inPrompts: true,
    };

    window.electronAPI.databaseIpcRenderer
      .createMessage(newMessage)
      .then((message) => {
        dispatch(setNewUserMessage(message));
        setMessage("");
      });

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

  const { ref: inputBoxRef, focused } = useFocusWithin<HTMLDivElement>();
  const textInputRef = useRef<HTMLTextAreaElement>(null);

  const isPromptResponsing = useAppSelector(
    (state) => state.prompt.isPromptResponsing
  );

  const [actionId] = useState<string>(v4());
  const runningActionId = useAppSelector((state) => state.prompt.actionId);
  const answerContent = useAppSelector((state) => state.prompt.answerContent);

  useEffect(() => {
    if (runningActionId === actionId) {
      setMessage(answerContent);
    }
  }, [answerContent, runningActionId]);

  const handlePromptAction = (prompt: Prompt) => {
    dispatch(setActionId(actionId));
    setToolbarState(prompt.name);
    historyMessage = message;
    requestPromptApi(prompt, message);
  };

  useEffect(() => {
    if (runningActionId !== actionId) {
      return;
    }
    if (!isPromptResponsing) {
      setToolbarState("toolbar");
      textInputRef.current.focus();
    }
  }, [isPromptResponsing, runningActionId]);

  useEffect(() => {
    if (focused && !isResponsing) {
      setToolbarState("toolbar");
    }
  }, [isResponsing]);

  const [toolbarState, setToolbarState] = useState<string>("");

  const [toolbarItems, setToolbarItems] = useState<Prompt[]>([]);

  useEffect(() => {
    const ids = window.electronAPI.storeIpcRenderer.get(
      "chat_input_toolbar_items"
    ) as number[];
    window.electronAPI.databaseIpcRenderer
      .getPromptsByIds(ids)
      .then((prompts) => {
        setToolbarItems(prompts);
      });
  }, [chatId]);

  useEffect(() => {
    setMessage("");
    if (chatId === -1) {
      textInputRef.current.focus();
    }
  }, [chatId]);

  const textAreaInputWaitingActionResponseState = () =>
    isPromptResponsing && runningActionId === actionId;

  return (
    <div className="h-full flex flex-col overflow-hidden flex-1">
      <div
        className="bg-gray-50 flex-1 px-4 py-2 overflow-auto relative chat-messages-view flex flex-col"
        ref={chatsContainer}
      >
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
            <div key={message.id}>
              <MessageItem msg={message} index={i} />
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
        {isWaitingRes || isResponsing ? (
          <RenderStopGenerationButton />
        ) : (
          <Statistics messages={messages}></Statistics>
        )}
      </div>
      <div ref={inputBoxRef}>
        <div
          className={clsx(
            "bg-white gap-1 w-full flex items-center justify-center px-4 transition-all ease-linear duration-100 overflow-y-hidden",
            toolbarState && focused
              ? "h-8 py-1 opacity-100"
              : "h-0 py-0 opacity-0"
          )}
        >
          {toolbarItems.map((item, i) => (
            <Button
              loading={toolbarState === item.name}
              key={i}
              className="font-greycliff h-6"
              radius="lg"
              size="xs"
              color="blue"
              onClick={() => handlePromptAction(item)}
            >
              {item.name}
            </Button>
          ))}
        </div>
        <div className="bg-gray-100 p-4 flex items-center">
          <IconMessageCircle size={20} className="mr-2" />
          <form
            className="flex items-center justify-between flex-1"
            onSubmit={handleSendMessage}
          >
            <Textarea
              ref={textInputRef}
              error={textAreaError ? "信息超出tokens限制" : undefined}
              value={message}
              onChange={(event) => {
                setMessage(event.target.value);
                dispatch(setMessageTokens(event.target.value.trim()));
              }}
              disabled={textAreaInputWaitingActionResponseState()}
              onFocus={() => setToolbarState("activate")}
              onCompositionStart={() => {
                isComposing = true;
              }}
              onCompositionEnd={() => {
                isComposing = false;
              }}
              onKeyDown={(event) => {
                handleKeyDown(event);
              }}
              placeholder={
                textAreaInputWaitingActionResponseState()
                  ? "Waiting..."
                  : "Type your message here..."
              }
              className="flex-1 mr-2"
              autosize
              minRows={1}
              maxRows={5}
              rightSection={
                isPromptResponsing ? (
                  <div className="flex items-end">
                    <ActionIcon
                      color="red"
                      size="sm"
                      onClick={() => dispatch(setPromptIsResponsing(false))}
                    >
                      <IconX size={12} />
                    </ActionIcon>
                  </div>
                ) : (
                  <div className="flex items-end">
                    <ActionIcon
                      color="blue"
                      size="sm"
                      onClick={() => setMessage(historyMessage)}
                    >
                      <IconArrowBackUp size={12} />
                    </ActionIcon>
                  </div>
                )
              }
            ></Textarea>
            <ActionIcon color="blue" type="submit" variant="subtle" size="sm">
              <IconSend size={16} />
            </ActionIcon>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chat;
