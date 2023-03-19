import { IconBrandOpenai } from "@tabler/icons-react";
import { Markdown } from "../../pureComponents/Markdown";
import { Message } from "../../database/models/Message";
import MessageBar from "./MessageBar";
import { Text } from "@mantine/core";

const ChatGPTMessage = ({ msg, index }: { msg: Message; index: number }) => {
  return (
    <div className="px-3 my-6 border-solid border-0 border-l-2 border-blue-300">
      <div className="flex justify-start items-center mb-1 w-full">
        <div className="flex justify-start items-center">
          <IconBrandOpenai className="text-blue-500 mr-1" size={12} />
          <Text size="xs" weight={700} className="mr-2">
            ChatGPT
          </Text>
        </div>
        <MessageBar msg={msg} index={index} />
      </div>
      <Text size="sm" className="ml-4">
        <Markdown text={msg.text} />
      </Text>
    </div>
  );
};

export default ChatGPTMessage;
