import { IconAlien } from "@tabler/icons-react";
import { Message } from "../../database/models/Message";
import MessageBar from "./MessageBar";
import { Text } from "@mantine/core";

const UserMessage = ({ msg, index }: { msg: Message; index: number }) => {
  return (
    <div className="mt-2 bg-white px-3 py-3 rounded-lg">
      <div className="flex justify-start mb-3">
        <div className="flex justify-center items-center w-full">
          <div className="flex justify-start items-center">
            <IconAlien size={12} className="text-gray-400 mr-1" />
            <Text size="xs" weight={700} className="text-gray-600 mr-2">
              Alien
            </Text>
          </div>
          <MessageBar msg={msg} index={index} />
        </div>
      </div>
      <div className="flex justify-start ml-4">
        {/* <div className="text-sm whitespace-pre-wrap">{msg.text}</div> */}
        <Text size="sm" className="whitespace-pre-wrap">
          {msg.text}
        </Text>
      </div>
    </div>
  );
};

export default UserMessage;
