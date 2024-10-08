import { Textarea, ActionIcon, clsx, useMantineTheme } from "@mantine/core";
import { IconX, IconArrowBackUp, IconBrandTelegram } from "@tabler/icons-react";
import {
  ChangeEvent,
  forwardRef,
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  requestApi,
  requestPromptApi,
} from "@/webview/services/openAI/apiConfig";
import { dateToTimestamp } from "@/webview/services/utils/DateTimestamp";
import { Message } from "@/database/models/Message";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import {
  setMessageTokens,
  setNewUserMessage,
  setTokensBoxWarningStateTo,
  updateChatsAfterCreated,
} from "@/webview/reducers/chatSlice";
import {
  setActionId,
  setPromptIsResponsing,
} from "@/webview/reducers/promptSlice";
import { InputActionBar } from "./InputActionBar";
import { Prompt } from "@/database/models/Prompt";
import { useFocusWithin, useMergedRef } from "@mantine/hooks";
import { useTranslation } from "react-i18next";
import { ChatContext } from "..";
import { createDebounce } from "@/webview/utils/debounce";

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

interface ChatInputBoxProps {
  chatId: number;
  messages: Message[];
}

let isComposing = false;
let historyMessage = "";

const ChatInputBox = forwardRef(
  (
    { messages, chatId }: ChatInputBoxProps,
    ref: MutableRefObject<HTMLTextAreaElement>
  ) => {
    const dispatch = useAppDispatch();
    const isPromptResponsing = useAppSelector(
      (state) => state.prompt.isPromptResponsing
    );
    const isResponsing = useAppSelector((state) => state.chat.isResponsing);
    const modelSelectBeforeChatCreated = useAppSelector((state) =>
      state.chat.selectedChat ? state.chat.selectedChat.model : ""
    );
    const promptTokens = useAppSelector(
      (state) => state.chat.totalPromptTokens
    );
    const runningActionId = useAppSelector((state) => state.prompt.actionId);
    const answerContent = useAppSelector((state) => state.prompt.answerContent);
    const [message, setMessage] = useState<string>();
    const [actionsBarVisible, setActionsBarVisible] = useState<boolean>(false);
    const textAreaInputWaitingActionResponseState = useMemo(
      () => isPromptResponsing && runningActionId === "chat-action",
      [isPromptResponsing, runningActionId]
    );
    const { ref: inputBoxRef, focused } = useFocusWithin();
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const { t } = useTranslation();
    const _textAreaRef = useMergedRef(textAreaRef, ref);
    const { colorScheme } = useMantineTheme();
    const tokensLimit = useAppSelector(
      (state) =>
        (state.chat.selectedChat && state.chat.selectedChat.tokensLimit) ??
        state.settings.max_tokens
    );
    const { scrollToBottom } = useContext(ChatContext);
    const scrollToBottomIntv = useRef<NodeJS.Timer>();

    useEffect(() => {
      if (isResponsing) {
        scrollToBottomIntv.current = setInterval(() => {
          scrollToBottom();
        }, 800);
      } else {
        clearInterval(scrollToBottomIntv.current);
      }
    }, [isResponsing]);

    useEffect(() => {
      setActionsBarVisible(focused);
    }, [focused]);

    useEffect(() => {
      if (runningActionId === "chat-action") {
        setMessage(answerContent);
        if (!isPromptResponsing) {
          dispatch(setActionId(""));
          textAreaRef.current.focus();
        }
      }
    }, [answerContent, isPromptResponsing]);

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
    const handleSendMessage = async (e: React.FormEvent) => {
      e.preventDefault();
      setActionsBarVisible(false);

      // Check if message is empty and is waiting responsing state
      if (!message || message.trim() === "" || isResponsing) {
        return;
      }

      // Check limits
      if (promptTokens > tokensLimit) {
        dispatch(setTokensBoxWarningStateTo("tokens_limit"));
        return;
      }

      // If it's a new chat, create it.
      let _chatId: number = chatId;
      if (_chatId === -1) {
        _chatId = await window.electronAPI.databaseIpcRenderer.createChat(
          Object.assign(
            {
              name: getFirstSentence(message),
              timestamp: dateToTimestamp(new Date()),
              model: modelSelectBeforeChatCreated,
            },
            modelSelectBeforeChatCreated
              ? { model: modelSelectBeforeChatCreated }
              : {}
          )
        );
        dispatch(updateChatsAfterCreated(_chatId));
      }

      // New message object
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

      // Filter out the messages that should be in prompt
      const sendMessages: Message[] = [...messages, newMessage].filter(
        (msg) => msg.inPrompts
      );

      // Send request to OpenAI
      requestApi(_chatId, sendMessages).then(() => {
        setMessage("");
        scrollToBottom();
      });
    };
    const handlePromptAction = (prompt: Prompt): boolean => {
      if (!message || !message.trim()) {
        return false;
      }
      dispatch(setActionId("chat-action"));
      historyMessage = message;
      requestPromptApi(prompt, message);
      return true;
    };

    const calTokensWhenChange = useCallback(
      createDebounce((event: ChangeEvent<HTMLTextAreaElement>) => {
        dispatch(setMessageTokens(event.target.value.trim()));
      }, 500),
      []
    );

    return (
      <div ref={inputBoxRef}>
        <div
          className={clsx(
            "p-3 flex items-center border-solid border-0 border-t",
            colorScheme === "dark" && "bg-dark-900 border-dark-900",
            colorScheme === "light" && "bg-white border-gray-200"
          )}
        >
          <form
            className="flex items-center justify-between flex-1"
            onSubmit={handleSendMessage}
          >
            <Textarea
              ref={_textAreaRef}
              value={message}
              variant="filled"
              onChange={(event) => {
                setMessage(event.target.value);
                calTokensWhenChange(event);
              }}
              disabled={textAreaInputWaitingActionResponseState}
              onFocus={() => setActionsBarVisible(true)}
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
                textAreaInputWaitingActionResponseState
                  ? "Waiting..."
                  : t("chat_input_tooltip")
              }
              className="flex-1 mr-2"
              autosize
              minRows={1}
              maxRows={15}
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
                      color="violet"
                      size="sm"
                      onClick={() => setMessage(historyMessage)}
                    >
                      <IconArrowBackUp
                        className={
                          colorScheme === "dark"
                            ? "text-dark-100"
                            : "text-violet-500"
                        }
                        size={12}
                      />
                    </ActionIcon>
                  </div>
                )
              }
            ></Textarea>
            <ActionIcon color="violet" type="submit" variant="subtle" size="sm">
              {/* <IconSend size={16} /> */}
              <IconBrandTelegram
                className={
                  colorScheme === "dark" ? "text-dark-100" : "text-violet-500"
                }
                size={16}
              />
            </ActionIcon>
          </form>
        </div>
      </div>
    );
  }
);

export default ChatInputBox;
