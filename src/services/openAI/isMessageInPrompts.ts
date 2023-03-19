import { Message } from "../../database/models/Message";

export const isMessageInPrompts = (
  messages: Message[],
  maxMessageLengthInPrompts = 0
) => {
  const _maxMessageLengthInPrompts = Math.max(
    window.electronAPI.storeIpcRenderer.get("max_messages_num") as number,
    maxMessageLengthInPrompts
  );

  const maxMessageBoolean = (n: number) => {
    if (_maxMessageLengthInPrompts) {
      return n > _maxMessageLengthInPrompts;
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
      reverseMessages[i].inPrompts === undefined
    ) {
      reverseMessages[i].inPrompts = true;
      if (
        window.electronAPI.othersIpcRenderer.calMessagesTokens(
          reverseMessages
            .slice(0, i + 1)
            .filter((msg) => msg.inPrompts)
            .map((msg) => ({ role: msg.sender, content: msg.text }))
        ) >= window.electronAPI.storeIpcRenderer.get("max_tokens") ||
        maxMessageBoolean(
          reverseMessages.slice(0, i + 1).filter((msg) => msg.inPrompts).length
        )
      ) {
        reverseMessages[i].inPrompts = false;
        break;
      }
    }
  }

  return reverseMessages.reverse();
};
