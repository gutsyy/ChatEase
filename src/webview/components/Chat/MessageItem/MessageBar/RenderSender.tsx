import { Message } from "@/database/models/Message";
import { clsx, useMantineTheme, Text } from "@mantine/core";
import { IconBrandOpenai, IconUserCircle } from "@tabler/icons-react";
import { memo } from "react";

type RenderSenderProps = Pick<Message, "sender" | "inPrompts">;

const RenderSender = (msg: RenderSenderProps) => {
  const { colorScheme } = useMantineTheme();
  const dark = colorScheme === "dark";

  return (
    <div className="flex justify-start items-center">
      {msg.sender === "assistant" ? (
        <IconBrandOpenai
          className={clsx(
            "mr-1",
            !msg.inPrompts && (dark ? "text-dark-400" : "text-gray-300"),
            msg.inPrompts && "text-violet-500"
          )}
          size={12}
        />
      ) : (
        <IconUserCircle
          size={13}
          className={clsx(
            "mr-1",
            !dark
              ? msg.inPrompts
                ? "text-gray-500"
                : "text-gray-300"
              : msg.inPrompts
              ? "text-dark-100"
              : "text-dark-400"
          )}
        />
      )}
      <Text
        size="xs"
        weight={500}
        className={clsx("mr-2", !msg.inPrompts && "text-gray-300")}
      >
        <span
          className={clsx(
            dark && (msg.inPrompts ? "text-dark-100" : "text-dark-400")
          )}
        >
          {msg.sender === "user" ? "You" : "ChatGPT"}
        </span>
      </Text>
    </div>
  );
};

export default memo(RenderSender);
