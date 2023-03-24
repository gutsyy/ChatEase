import { IconAlien } from "@tabler/icons-react";
import { Message } from "../../database/models/Message";
import MessageBar from "./MessageBar";
import { clsx, Text } from "@mantine/core";
import { useAppDispatch } from "../../hooks/redux";
import { updateMessages } from "../../reducers/app";
import { useRef } from "react";

const UserMessage = ({ msg, index }: { msg: Message; index: number }) => {
  const dispatch = useAppDispatch();

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const onDelete = () => {
    if (containerRef.current && contentRef.current) {
      containerRef.current.style.maxHeight = `${
        contentRef.current.clientHeight + 8
      }px`;
      containerRef.current.style.opacity = "1";
    }

    containerRef.current.className = "transition-all ease-out duration-300";

    containerRef.current.addEventListener("transitionend", () => {
      window.electronAPI.databaseIpcRenderer.deleteMessage(msg.id);
      dispatch(updateMessages(msg.chatId));
    });

    setTimeout(() => {
      containerRef.current.style.maxHeight = "0px";
      containerRef.current.style.opacity = "0";
    });
  };

  return (
    <div ref={containerRef} style={{ overflow: "hidden" }}>
      <div className="mt-2 bg-white px-3 py-3 rounded-lg" ref={contentRef}>
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
            <MessageBar msg={msg} index={index} onDelete={onDelete} />
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
    </div>
  );
};

export default UserMessage;
