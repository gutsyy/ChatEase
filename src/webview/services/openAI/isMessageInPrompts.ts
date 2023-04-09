import { Chat } from "@/database/models/Chat";
import { Message } from "@/database/models/Message";
import { appSettings } from "@/webview/utils/settings";

/** Calculate the Message.inPrompts attribute for each message based on the limitations on tokens and the number of messages. */
export const isMessageInPrompts = (
  messages: Message[],
  currentChat: Chat | null,
  forceUpdate = false,
  maxMessageLengthInPrompts = 0
) => {
  // TODO: what maxMessageLengthInPrompts is used for?
  const _maxMessageLengthInPrompts = Math.max(
    appSettings.get("max_messages_num") as number,
    maxMessageLengthInPrompts
  );

  const messagesLimit =
    (currentChat && currentChat.messagesLimit) ?? _maxMessageLengthInPrompts;

  const tokensLimit =
    (currentChat && currentChat.tokensLimit) ??
    (appSettings.get("max_tokens") as number);

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

  const pinnedMessages = reverseMessages.filter((msg) => msg.fixedInPrompt);
  const unpinMessages = reverseMessages.filter((msg) => !msg.fixedInPrompt);
  const pinnedMessagesTokens = pinnedMessages.length
    ? window.electronAPI.othersIpcRenderer.calMessagesTokens(
        pinnedMessages.map((msg) => ({
          role: msg.sender,
          content: msg.text,
        }))
      )
    : 0;

  for (let i = 0; i < unpinMessages.length; i++) {
    if (
      unpinMessages[i].inPrompts === true ||
      unpinMessages[i].inPrompts === undefined ||
      forceUpdate
    ) {
      unpinMessages[i].inPrompts = true;
      // if (unpinMessages[i].fixedInPrompt) {
      //   continue;
      // }

      if (
        window.electronAPI.othersIpcRenderer.calMessagesTokens(
          unpinMessages
            .slice(0, i + 1)
            .filter((msg) => msg.inPrompts)
            .map((msg) => ({ role: msg.sender, content: msg.text }))
        ) +
          pinnedMessagesTokens >
          tokensLimit ||
        maxMessageBoolean(
          unpinMessages.slice(0, i + 1).filter((msg) => msg.inPrompts).length +
            pinnedMessages.length
        )
      ) {
        for (let j = i; j < unpinMessages.length; j++) {
          unpinMessages[j].inPrompts = false;
        }
        break;
      }
    }
  }

  pinnedMessages.forEach((msg) => {
    msg.inPrompts = true;
  });

  return reverseMessages.reverse();
};
