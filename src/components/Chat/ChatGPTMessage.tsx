import { IconBrandOpenai } from "@tabler/icons-react";
import { Markdown } from "../../pureComponents/Markdown";
import { Message } from "../../database/models/Message";
import MessageBar from "./MessageBar";
import { clsx, Text } from "@mantine/core";
import { useRef } from "react";
import { useAppDispatch } from "../../hooks/redux";
import { updateMessages } from "../../reducers/app";

const ChatGPTMessage = ({ msg, index }: { msg: Message; index: number }) => {
  const dispatch = useAppDispatch();

  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const onDelete = () => {
    if (containerRef.current && contentRef.current) {
      containerRef.current.style.maxHeight = `${
        contentRef.current.clientHeight + 32
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
      <div className="p-3 my-4 bg-gray-100 rounded-lg" ref={contentRef}>
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
              className={clsx(
                "mr-2 font-greycliff tracking-wide",
                !msg.inPrompts && "text-gray-300"
              )}
            >
              ChatGPT
            </Text>
          </div>
          <MessageBar msg={msg} index={index} onDelete={onDelete} />
        </div>
        <Text
          size="sm"
          className={clsx(
            "ml-4 mr-2",
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
    </div>
  );
};

export default ChatGPTMessage;
