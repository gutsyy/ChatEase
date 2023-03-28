import { IconAlien, IconBrandOpenai } from "@tabler/icons-react";
import { Markdown } from "../../pureComponents/Markdown";
import { Message } from "../../database/models/Message";
import MessageItemBar from "./MessageItemBar";
import { Button, clsx, Collapse, Divider, Text } from "@mantine/core";
import { useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { updateMessages } from "../../reducers/chatSlice";
import { useDisclosure } from "@mantine/hooks";
import { v4 } from "uuid";
import { setPromptIsResponsing } from "../../reducers/promptSlice";

const StopGenerationButton = ({ actionId }: { actionId: string }) => {
  const dispatch = useAppDispatch();
  const runningActionId = useAppSelector((state) => state.prompt.actionId);
  const isPromptResponsing = useAppSelector(
    (state) => state.prompt.isPromptResponsing
  );

  return (
    <>
      {runningActionId === actionId && isPromptResponsing && (
        <div className="sticky w-full flex bg-transparent justify-center bottom-0">
          <Button
            size="xs"
            color="red"
            radius="lg"
            className="h-6"
            variant="light"
            onClick={() => {
              dispatch(setPromptIsResponsing(false));
            }}
          >
            Stop Generation
          </Button>
        </div>
      )}
    </>
  );
};

const MessageItem = ({ msg, index }: { msg: Message; index: number }) => {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const [opened, { toggle }] = useDisclosure(true);

  const onDelete = () => {
    if (containerRef.current && contentRef.current) {
      containerRef.current.style.maxHeight = `${
        contentRef.current.clientHeight + 16
      }px`;
      containerRef.current.style.opacity = "1";

      containerRef.current.className = "transition-all ease-out duration-300";

      containerRef.current.addEventListener("transitionend", () => {
        window.electronAPI.databaseIpcRenderer
          .deleteMessage(msg.id)
          .then(() => {
            dispatch(updateMessages(msg.chatId));
          });
      });

      setTimeout(() => {
        containerRef.current.style.maxHeight = "0px";
        containerRef.current.style.opacity = "0";
      });
    }
  };

  const [actionId] = useState(v4());

  return (
    <div ref={containerRef} style={{ overflow: "hidden" }}>
      <div
        className={clsx(
          "p-3 mb-4 rounded-lg relative",
          msg.sender === "user" && "bg-white",
          msg.sender === "assistant" && "bg-gray-100"
        )}
        ref={contentRef}
      >
        <div className="flex justify-start items-center mb-1 w-full">
          <div className="flex justify-start items-center">
            {msg.sender === "assistant" ? (
              <IconBrandOpenai
                className={clsx(
                  "mr-1",
                  !msg.inPrompts && "text-gray-300",
                  msg.inPrompts && "text-blue-500"
                )}
                size={12}
              />
            ) : (
              <IconAlien
                size={12}
                className={clsx(
                  "mr-1",
                  msg.inPrompts && "text-gray-400",
                  !msg.inPrompts && "text-gray-300"
                )}
              />
            )}
            <Text
              size="xs"
              weight={700}
              className={clsx(
                "mr-2 font-greycliff tracking-wide",
                !msg.inPrompts && "text-gray-300"
              )}
              style={{
                transform: "translateY(0.8px)",
              }}
            >
              <span>{msg.sender === "user" ? "You" : "ChatGPT"}</span>
            </Text>
          </div>
          <MessageItemBar
            msg={msg}
            index={index}
            actionId={actionId}
            onDelete={onDelete}
            expanded={opened}
            onToggleExpanded={toggle}
          />
        </div>
        <Collapse
          in={opened}
          transitionDuration={300}
          transitionTimingFunction="linear"
        >
          <Text
            size="sm"
            className={clsx(
              "ml-4 mr-2",
              msg.inPrompts && "text-gray-900",
              !msg.inPrompts && "text-gray-400",
              msg.sender === "user" && "whitespace-pre-wrap"
            )}
          >
            {msg.sender === "assistant" ? (
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
            ) : (
              <p>{msg.text}</p>
            )}
          </Text>
          {msg.actionResult && (
            <>
              <Divider
                label="Action Result"
                labelPosition="center"
                color="gray"
                variant="dashed"
                className="mx-4"
                styles={{
                  label: {
                    font: "Greycliff CF",
                    fontWeight: 700,
                  },
                }}
              />
              <Text
                size="sm"
                className={clsx(
                  "ml-4 mr-2",
                  msg.inPrompts && "text-gray-900",
                  !msg.inPrompts && "text-gray-400",
                  msg.sender === "user" && "whitespace-pre-wrap"
                )}
              >
                {msg.sender === "assistant" ? (
                  <Markdown
                    text={msg.actionResult}
                    codeScope={(
                      window.electronAPI.storeIpcRenderer.get(
                        "markdown_code_scope"
                      ) as string
                    )
                      .split(",")
                      .map((language) => language.trim())}
                  />
                ) : (
                  <p>{msg.actionResult}</p>
                )}
              </Text>
            </>
          )}
        </Collapse>
        <StopGenerationButton actionId={actionId} />
      </div>
    </div>
  );
};

export default MessageItem;
