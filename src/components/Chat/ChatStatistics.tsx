import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setTokensBoxWarningStateToFalse } from "../../reducers/chatSlice";
import { clsx, Text } from "@mantine/core";

interface ChatStatisticsProps {
  messagesInPromptsNum: number;
}

export const ChatStatistics = ({
  messagesInPromptsNum,
}: ChatStatisticsProps) => {
  const dispatch = useAppDispatch();
  const warningState = useAppSelector(
    (state) => state.chat.tokensBoxWarningState
  );
  const messageTokens = useAppSelector((state) => state.chat.inputBoxTokens);
  const promptTokens = useAppSelector((state) => state.chat.totalPromptTokens);

  const messages_limit =
    window.electronAPI.storeIpcRenderer.get("max_messages_num");
  const tokens_limit = window.electronAPI.storeIpcRenderer.get("max_tokens");

  useEffect(() => {
    if (warningState) {
      setTimeout(() => {
        dispatch(setTokensBoxWarningStateToFalse());
      }, 2500);
    }
  }, [warningState]);

  return (
    <div className="sticky bg-transparent flex justify-center bottom-0 z-50">
      <div
        className={clsx(
          "italic bg-white text-gray-900 px-3 py-1 rounded-full shadow overflow-hidden",
          warningState && "outline outline-2 outline-red-500"
        )}
        style={{
          display: "inline-block",
          height: warningState ? "42.59px" : "26.59px",
          transition: "all 0.15s ease-in-out",
        }}
      >
        {warningState ? (
          <div className="text-red-500 font-semibold text-xs flex justify-center items-center">
            Operation failed: Exceeding limit!
          </div>
        ) : null}
        <div className="flex justify-center items-center italic">
          <Text
            size="xs"
            className={
              warningState === "tokens_limit" ? "text-red-500 font-bold" : ""
            }
          >
            {`Tokens in prompt: ${
              promptTokens + messageTokens
            } (max: ${tokens_limit})`}
          </Text>
          <Text
            size="xs"
            className={clsx(
              "ml-2",
              warningState === "messages_limit" && "text-red-500 font-bold"
            )}
          >
            {`Messages in prompt: ${messagesInPromptsNum} (max: ${messages_limit})`}
          </Text>
        </div>
      </div>
    </div>
  );
};
