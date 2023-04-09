import { get_encoding } from "@dqbd/tiktoken";
import { ChatGPTMessageType } from "@/webview/services/openAI/apiConfig";

const enc = get_encoding("cl100k_base");

export const num_tokens_from_messages = (
  messages: ChatGPTMessageType[],
  single = false
) => {
  let num_tokens = 0;
  for (const message of messages) {
    num_tokens += 4;
    for (const [key, value] of Object.entries(message)) {
      num_tokens += enc.encode(value).length;
      if (key === "name") {
        num_tokens += -1;
      }
    }
  }
  if (!single) {
    num_tokens += 2;
  }
  return num_tokens;
};
