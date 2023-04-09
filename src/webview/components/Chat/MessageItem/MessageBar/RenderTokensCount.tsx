import { Message } from "@/database/models/Message";
import { useMantineTheme, clsx } from "@mantine/core";
import { memo } from "react";

type RenderTokensCountProps = Pick<Message, "inPrompts" | "sender" | "text">;

const RenderTokensCount = (msg: RenderTokensCountProps) => {
  const { colorScheme } = useMantineTheme();
  return (
    <div
      className={clsx(
        "text-xs px-1 ml-3 rounded-sm mr-1 font-greycliff",
        colorScheme === "light"
          ? msg.inPrompts
            ? "bg-violet-100 text-violet-500"
            : "bg-gray-200 text-white"
          : msg.inPrompts
          ? "text-dark-100 font-bold"
          : "text-dark-400 font-bold"
      )}
    >{`${window.electronAPI.othersIpcRenderer.calMessagesTokens(
      [
        {
          role: msg.sender,
          content: msg.text,
        },
      ],
      true
    )} tokens`}</div>
  );
};

export default memo(RenderTokensCount);
