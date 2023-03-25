import store from "../../store";
import { Message } from "../../database/models/Message";
import { PostRequest } from "../../ipcBridge/types";
import { dateToTimestamp } from "../utils/DateTimestamp";
import { handleNotis } from "../utils/notis";
import {
  setIsResponsing,
  setIsWaitingRes,
  setNewGPTMessage,
  setStreamGPTMessage,
  setStreamGPTMessageDone,
  setStreamGPTMessageStart,
} from "../../reducers/chatSlice";
import { v4 as UUIDV4 } from "uuid";
import {
  setAnswerContent,
  setPromptIsResponsing,
} from "../../reducers/promptSlice";

export type ChatGPTMessageType = {
  role: string;
  content: string;
};

export interface ChatCompletion {
  id: string;
  object: string;
  created: number;
  model: string;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices: [
    {
      message: ChatGPTMessageType;
      finish_reason: string;
      index: number;
    }
  ];
}

export const axiosConfigChatGPT = (
  message: ChatGPTMessageType[]
): PostRequest => {
  const key = window.electronAPI.storeIpcRenderer.get("open_api_key");
  const origin = window.electronAPI.storeIpcRenderer.get("openai_api_origin");

  if (!key) {
    handleNotis({
      title: "OpenAI API key 未设置",
      message: "",
      type: "error",
    });
    throw new Error("OpenAI API key is not set.");
  }

  return {
    url: `${origin}`,
    body: {
      model: "gpt-3.5-turbo",
      messages: message,
      stream: window.electronAPI.storeIpcRenderer.get("stream_enable"),
    },
    config: {
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
    },
  };
};

// Create new Message
const createNewGPTMessage = (content: string, chatId: number): Message => {
  return {
    chatId: chatId,
    sender: "assistant",
    text: content,
    timestamp: dateToTimestamp(new Date()),
    inPrompts: true,
  };
};

export const requestApi = (chatId: number, messages: Message[]) => {
  const requestId = UUIDV4();

  store.dispatch(setIsResponsing(true));
  // const dispatch = useAppDispatch();
  const streamEnable = window.electronAPI.storeIpcRenderer.get(
    "stream_enable"
  ) as boolean;
  // if Stream, open Listener

  const streamCallback = (event: any, data: any, id: string) => {
    if (id !== requestId) {
      return;
    }
    const isResponsing = store.getState().chat.isResponsing;
    if (data === "DONE" || !isResponsing) {
      store.dispatch(setStreamGPTMessageDone());
      // remove Listener
      window.electronAPI.othersIpcRenderer.removeAllListeners(`axios-stream`);
      return;
    }
    if (data.choices[0].delta.role) {
      store.dispatch(setStreamGPTMessageStart(createNewGPTMessage("", chatId)));
      return;
    }
    if (data.choices[0].delta.content) {
      store.dispatch(
        setStreamGPTMessage({
          chatId: chatId,
          text: data.choices[0].delta.content,
        })
      );
      return;
    }
  };

  if (streamEnable) {
    window.electronAPI.axiosIpcRenderer.stream(streamCallback);
  }

  window.electronAPI.axiosIpcRenderer
    .post(
      axiosConfigChatGPT(
        messages.map((message) => ({
          role: message.sender,
          content: message.text,
        }))
      ),
      requestId,
      streamEnable
    )
    .then((res) => {
      if (!store.getState().chat.isWaitingRes) {
        return;
      }
      store.dispatch(setIsWaitingRes(false));
      if (streamEnable) return;
      store.dispatch(setIsResponsing(false));
      if (!res) {
        store.dispatch(
          setNewGPTMessage(createNewGPTMessage("Network Error !!!", chatId))
        );
        return;
      }
      if (res.choices && res.choices.length > 0) {
        const responseMessage = createNewGPTMessage(
          res.choices[0].message.content,
          chatId
        );
        window.electronAPI.databaseIpcRenderer.createMessage(responseMessage);
        store.dispatch(setNewGPTMessage(responseMessage));
      }
    });
};

export const requestPromptApi = (messages: ChatGPTMessageType[]) => {
  const requestId = UUIDV4();

  store.dispatch(setPromptIsResponsing(true));
  // const dispatch = useAppDispatch();
  const streamEnable = window.electronAPI.storeIpcRenderer.get(
    "stream_enable"
  ) as boolean;
  // if Stream, open Listener

  const streamCallback = (event: any, data: any, id: string) => {
    if (id !== requestId) {
      return;
    }
    const isResponsing = store.getState().prompt.isPromptResponsing;
    if (data === "DONE" || !isResponsing) {
      store.dispatch(setPromptIsResponsing(false));
      // remove Listener
      window.electronAPI.othersIpcRenderer.removeAllListeners(`axios-stream`);
      return;
    }
    if (data.choices[0].delta.role) {
      // store.dispatch(setStreamGPTMessageStart(createNewGPTMessage("", chatId)));
      return;
    }
    if (data.choices[0].delta.content) {
      store.dispatch(setAnswerContent(data.choices[0].delta.content));
      return;
    }
  };

  if (streamEnable) {
    window.electronAPI.axiosIpcRenderer.stream(streamCallback);
  }

  window.electronAPI.axiosIpcRenderer
    .post(axiosConfigChatGPT(messages), requestId, streamEnable)
    .then((res) => {
      if (!store.getState().prompt.isPromptResponsing) {
        return;
      }
      // store.dispatch(setIsWaitingRes(false));
      if (streamEnable) return;
      store.dispatch(setPromptIsResponsing(false));
      if (!res) {
        store.dispatch(setAnswerContent("Network Error !!!"));
        return;
      }
      if (res.choices && res.choices.length > 0) {
        store.dispatch(setAnswerContent(res.choices[0].message.content));
      }
    });
};
