import { IconBrandOpenai } from "@tabler/icons-react";
import { Markdown } from "../../pureComponents/Markdown";
import { Message } from "../../database/models/Message";
import MessageBar from "./MessageBar";
import { clsx, Text } from "@mantine/core";

const ChatGPTMessage = ({ msg, index }: { msg: Message; index: number }) => {
  return (
    <div className="p-3 my-6 bg-slate-100 rounded-lg shadow">
      <div className="flex justify-start items-center mb-1 w-full">
        <div className="flex justify-start items-center">
          <IconBrandOpenai
            className={clsx(
              "mr-1",
              !msg.inPrompts && "text-gray-300",
              msg.inPrompts && "text-blue-500"
            )}
            size={12}
          />
          <Text
            size="xs"
            weight={700}
            className={clsx("mr-2", !msg.inPrompts && "text-gray-300")}
          >
            ChatGPT
          </Text>
        </div>
        <MessageBar msg={msg} index={index} />
      </div>
      <Text
        size="sm"
        className={clsx(
          "ml-4",
          msg.inPrompts && "text-gray-900",
          !msg.inPrompts && "text-gray-400"
        )}
      >
        <Markdown
          text={msg.text}
          codeScope={(
            window.electronAPI.storeIpcRenderer.get(
              "markdown_code_scope"
            ) as string
          )
            .split(",")
            .map((language) => language.trim())}
        />
      </Text>
    </div>
  );
};

export default ChatGPTMessage;
