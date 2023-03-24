import { IconAlien } from "@tabler/icons-react";
import { Message } from "../../database/models/Message";
import MessageBar from "./MessageBar";
import { clsx, Text } from "@mantine/core";

const UserMessage = ({ msg, index }: { msg: Message; index: number }) => {
  return (
    <div className="mt-2 bg-white px-3 py-3 rounded-lg shadow">
      <div className="flex justify-start mb-3">
        <div className="flex justify-center items-center w-full">
          <div className="flex justify-start items-center">
            <IconAlien
              size={12}
              className={clsx(
                "mr-1",
                msg.inPrompts && "text-gray-400",
                !msg.inPrompts && "text-gray-300"
              )}
            />
            <Text
              size="xs"
              weight={700}
              className={clsx(
                "mr-2",
                msg.inPrompts && "text-gray-600",
                !msg.inPrompts && "text-gray-300"
              )}
            >
              Alien
            </Text>
          </div>
          <MessageBar msg={msg} index={index} />
        </div>
      </div>
      <div className="flex justify-start ml-4">
        {/* <div className="text-sm whitespace-pre-wrap">{msg.text}</div> */}
        <Text
          // className=" whitespace-pre-wrap text-gray-400"
          size="sm"
          className={clsx(
            "whitespace-pre-wrap",
            msg.inPrompts && "text-gray-900",
            !msg.inPrompts && "text-gray-400"
          )}
        >
          {msg.text}
        </Text>
      </div>
    </div>
  );
};

export default UserMessage;
