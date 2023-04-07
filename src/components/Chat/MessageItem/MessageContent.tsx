import { useMantineTheme, Text } from "@mantine/core";
import clsx from "clsx";
import { Markdown } from "@/pureComponents/Markdown";
import { Message } from "../../../database/models/Message";
import { memo } from "react";

export interface MessageContentProps
  extends Pick<Message, "text" | "inPrompts" | "sender" | "actionResult"> {
  isActionResult?: boolean;
}

const MessageContent = ({
  text,
  inPrompts,
  sender,
  actionResult,
  isActionResult = false,
}: MessageContentProps) => {
  const { colorScheme } = useMantineTheme();

  const codeScope = (
    window.electronAPI.storeIpcRenderer.get("markdown_code_scope") as string
  )
    .split(",")
    .map((language) => language.trim());

  return (
    <Text
      size="xs"
      className={clsx(
        "ml-4 mr-2",
        inPrompts &&
          (colorScheme === "light" ? "text-gray-900" : "text-dark-100"),
        !inPrompts &&
          (colorScheme === "light" ? "text-gray-500" : "text-dark-400"),
        sender === "user" && "whitespace-pre-wrap"
      )}
    >
      {sender === "assistant" ? (
        <Markdown
          text={isActionResult ? actionResult : text}
          codeScope={codeScope}
          colorScheme={colorScheme}
        />
      ) : (
        <p>{isActionResult ? actionResult : text}</p>
      )}
    </Text>
  );
};

export default memo(MessageContent);
