import { useAppSelector } from "@/webview/hooks/redux";
import { requestApi } from "@/webview/services/openAI/apiConfig";
import { IconReload } from "@tabler/icons-react";
import React from "react";

export const RetryAction: React.FC = () => {
  const { selectedChat, isWaitingRes, messages } = useAppSelector(
    (state) => state.chat
  );

  if (
    messages[messages.length - 1]?.sender &&
    messages[messages.length - 1]?.sender === "user" &&
    !isWaitingRes
  ) {
    return (
      <div className="text-xs text-violet-500 flex items-center ml-2">
        <IconReload size="0.75rem" />
        <span
          className="hover:border-solid hover:border-0 hover:border-b hover:border-violet-500 hover:cursor-pointer ml-1"
          onClick={() => {
            requestApi(
              selectedChat.id,
              messages.filter((msg) => msg.inPrompts)
            );
          }}
        >
          立即重试
        </span>
      </div>
    );
  }

  return null;
};
