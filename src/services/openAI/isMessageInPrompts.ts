import { Chat } from "../../database/models/Chat";
import { Message } from "../../database/models/Message";

/** Calculate the Message.inPrompts attribute for each message based on the limitations on tokens and the number of messages. */
export const isMessageInPrompts = (
  messages: Message[],
  currentChat: Chat | null,
  forceUpdate = false,
  maxMessageLengthInPrompts = 0
) => {
  // TODO: what maxMessageLengthInPrompts is used for?
  const _maxMessageLengthInPrompts = Math.max(
    window.electronAPI.storeIpcRenderer.get("max_messages_num") as number,
    maxMessageLengthInPrompts
  );

  const messagesLimit =
    (currentChat && currentChat.messagesLimit) ?? _maxMessageLengthInPrompts;

  const tokensLimit =
    (currentChat && currentChat.tokensLimit) ??
    (window.electronAPI.storeIpcRenderer.get("max_tokens") as number);

  const maxMessageBoolean = (n: number) => {
    if (messagesLimit) {
      return n > messagesLimit;
    }
    return false;
  };

  // reverse messages and deep copy
  const reverseMessages: Message[] = JSON.parse(
    JSON.stringify([...messages].reverse())
  );

  for (let i = 0; i < reverseMessages.length; i++) {
    if (
      reverseMessages[i].inPrompts === true ||
      reverseMessages[i].inPrompts === undefined ||
      forceUpdate
    ) {
      reverseMessages[i].inPrompts = true;
      if (reverseMessages[i].fixedInPrompt) {
        continue;
      }
      console.log("tokenLimit", tokensLimit);
      if (
        window.electronAPI.othersIpcRenderer.calMessagesTokens(
          reverseMessages
            .slice(0, i + 1)
            .filter((msg) => msg.inPrompts || msg.fixedInPrompt)
            .map((msg) => ({ role: msg.sender, content: msg.text }))
        ) > tokensLimit ||
        maxMessageBoolean(
          reverseMessages.slice(0, i + 1).filter((msg) => msg.inPrompts)
            .length + reverseMessages.filter((msg) => msg.fixedInPrompt).length
        )
      ) {
        reverseMessages[i].inPrompts = false;
      }
    }
  }

  return reverseMessages.reverse();
};
