import { useAppSelector } from "@/webview/hooks/redux";
import { IconCircleLetterT, IconHistory } from "@tabler/icons-react";
import { Text, clsx } from "@mantine/core";
import { memo } from "react";

interface StatisticsProps {
  warningState: "tokens_limit" | "messages_limit" | "";
  messagesInPromptNum: number;
}

const Statistics = ({ warningState, messagesInPromptNum }: StatisticsProps) => {
  const messageTokens = useAppSelector((state) => state.chat.inputBoxTokens);
  const promptTokens = useAppSelector((state) => state.chat.totalPromptTokens);
  const selectedChat = useAppSelector((state) => state.chat.selectedChat);

  const messages_limit =
    (selectedChat && selectedChat.messagesLimit) ??
    window.electronAPI.storeIpcRenderer.get("max_messages_num");
  const tokens_limit =
    (selectedChat && selectedChat.tokensLimit) ??
    window.electronAPI.storeIpcRenderer.get("max_tokens");

  return (
    <div className="flex gap-1">
      <div className="flex flex-col justify-center items-center">
        {warningState && (
          <div className="text-red-500 font-semibold text-xs flex justify-center items-center">
            Operation failed: Exceeding limit!
          </div>
        )}
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <IconCircleLetterT size={13} />
            <Text
              size="xs"
              className={
                warningState === "tokens_limit" ? "text-red-500 font-bold" : ""
              }
            >
              {`${promptTokens + messageTokens} Tokens ${
                warningState && `Max: ${tokens_limit}`
              }`}
            </Text>
          </div>
          <div className="flex items-center gap-1">
            <IconHistory size={13} />
            <Text
              size="xs"
              className={clsx(
                warningState === "messages_limit" && "text-red-500 font-bold"
              )}
            >
              {`${messagesInPromptNum} Messages ${
                warningState && `Max: ${messages_limit}`
              }`}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Statistics);
