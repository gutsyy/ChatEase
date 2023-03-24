import { useEffect } from "react";
import { Message } from "../../database/models/Message";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { setTokensBoxWarningStateToFalse } from "../../reducers/app";
import { Text } from "@mantine/core";

const Statistics = ({ messages }: { messages: Message[] }) => {
  const dispatch = useAppDispatch();

  const warningState = useAppSelector(
    (state) => state.app.tokensBoxWarningState
  );

  useEffect(() => {
    if (warningState) {
      setTimeout(() => {
        dispatch(setTokensBoxWarningStateToFalse());
      }, 2500);
    }
  }, [warningState]);

  const messageTokens = useAppSelector((state) => state.app.messageTokens);

  const promptTokens = useAppSelector((state) => state.app.promptTokens);

  const messages_limit =
    window.electronAPI.storeIpcRenderer.get("max_messages_num");

  const tokens_limit = window.electronAPI.storeIpcRenderer.get("max_tokens");

  const messagesInPromptsLength = messages.filter(
    (msg) => msg.inPrompts
  ).length;

  const classDefaultStyles =
    "italic bg-white text-gray-900 px-3 py-1 rounded-full shadow-lg overflow-hidden";

  const classWarningStyles =
    "italic bg-white text-gray-900 px-3 py-1 rounded-full shadow-lg outline outline-2 outline-red-500 bg-red-300 px-4 overflow-hidden";

  return (
    <div className="sticky bg-transparent flex justify-center bottom-0 z-50">
      <div
        className={warningState ? classWarningStyles : classDefaultStyles}
        style={{
          display: "inline-block",
          height: warningState ? "42.59px" : "26.59px",
          transition: "all 0.15s ease-in-out",
        }}
      >
        {warningState ? (
          <div className="text-red-500 font-semibold text-xs flex justify-center items-center">
            操作失败：超出限制！！！
          </div>
        ) : null}
        <div className="flex justify-center items-center italic">
          <Text
            size="xs"
            className={
              warningState === "tokens_limit" ? "text-red-500 font-bold" : ""
            }
          >
            Tokens in prompt: {promptTokens + messageTokens} (max:
            {tokens_limit})
          </Text>
          <Text
            size="xs"
            className={
              "ml-2 " +
              (warningState === "messages_limit"
                ? "text-red-500 font-bold"
                : "")
            }
          >
            Messages in prompt: {messagesInPromptsLength} (max:
            {messages_limit})
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
