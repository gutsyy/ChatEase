import { useMantineTheme, Text, clsx } from "@mantine/core";
import { Markdown } from "@/webview//pureComponents/Markdown";
import { Message } from "@/database/models/Message";
import { memo } from "react";
import { useAppSelector } from "@/webview/hooks/redux";

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

  const codeScope = useAppSelector(
    (state) => state.settings.markdown_code_scope
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
