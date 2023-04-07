import { useMantineTheme } from "@mantine/core";
import clsx from "clsx";
import { Message } from "../../../../database/models/Message";
import { memo } from "react";

type RenderTimeProps = Pick<Message, "timestamp" | "inPrompts">;

const RenderTime = (msg: RenderTimeProps) => {
  const { colorScheme } = useMantineTheme();
  const dark = colorScheme === "dark";
  return (
    <div
      className={clsx(
        "text-xs italic",
        msg.inPrompts && (dark ? "text-gray-300" : "text-gray-400"),
        !msg.inPrompts && (dark ? "text-dark-400" : "text-gray-300")
      )}
    >
      {new Date(msg.timestamp * 1000).toLocaleTimeString()}
    </div>
  );
};

export default memo(RenderTime);
