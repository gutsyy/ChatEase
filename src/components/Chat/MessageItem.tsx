import {
  IconBrandOpenai,
  IconPin,
  IconUserCircle,
  IconX,
} from "@tabler/icons-react";
import { Markdown } from "../../pureComponents/Markdown";
import { Message } from "../../database/models/Message";
import MessageItemBar from "./MessageItemBar";
import {
  ActionIcon,
  Button,
  clsx,
  Collapse,
  Divider,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { memo, useCallback, useMemo, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  setMessageActionResultByIndex,
  toggleMessageCollapse,
  updateMessages,
} from "../../reducers/chatSlice";
import { v4 } from "uuid";
import { setPromptIsResponsing } from "../../reducers/promptSlice";

const MessageItem = ({ msg, index }: { msg: Message; index: number }) => {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const actionId = useMemo(() => v4(), [msg.id]);
  const { colorScheme } = useMantineTheme();
  const dark = colorScheme === "dark";

  const onDelete = useCallback(() => {
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
  }, [msg.id]);

  const onToggleCollapse = () => {
    dispatch(toggleMessageCollapse(index));
    window.electronAPI.databaseIpcRenderer.setMessageCollapseById(
      msg.id,
      !msg.collapse
    );
  };

  const onRemoveActionResult = () => {
    dispatch(setMessageActionResultByIndex({ index, text: "" }));
  };

  return (
    <div className="relative overflow-visible" ref={containerRef}>
      {msg.fixedInPrompt && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1 z-10 bg-violet-500 rounded-full w-4 h-4 flex justify-center items-center">
          <IconPin size={12} className="text-white" />
        </div>
      )}
      <div
        className={clsx(
          "p-3 mb-4 rounded-lg relative",
          msg.sender === "user" &&
            (colorScheme === "light" ? "bg-gray-50" : "bg-dark-750"),
          msg.sender === "assistant" &&
            (colorScheme === "light" ? "bg-gray-100" : "bg-dark-700")
          // msg.fixedInPrompt && "outline outline-1 outline-violet-500"
        )}
        ref={contentRef}
      >
        <div className="flex justify-start items-center w-full">
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
          <MessageItemBar
            msg={msg}
            index={index}
            actionId={actionId}
            onDelete={onDelete}
            expanded={!msg.collapse}
            onToggleExpanded={() => onToggleCollapse()}
          />
        </div>
        <Collapse
          in={!msg.collapse}
          transitionDuration={200}
          transitionTimingFunction="ease-out"
        >
          <div className="overflow-x-auto">
            <RenderContent msg={msg} msgKey={"text"} />
            {msg.actionResult && (
              <>
                <Divider
                  label={
                    <div className="font-greycliff font-bold flex justify-center items-center">
                      <div style={{ lineHeight: "1.125rem" }}>
                        Action Result
                      </div>
                      <ActionIcon
                        size="xs"
                        className="ml-4"
                        onClick={onRemoveActionResult}
                      >
                        <IconX size={12} />
                      </ActionIcon>
                    </div>
                  }
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
                <RenderContent msg={msg} msgKey={"actionResult"} />
              </>
            )}
          </div>
        </Collapse>
        <StopGenerationButton actionId={actionId} />
      </div>
    </div>
  );
};

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
            color="violet"
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

export const RenderContent = ({
  msg,
  msgKey,
}: {
  msg: Message;
  msgKey: "text" | "actionResult";
}) => {
  const { colorScheme } = useMantineTheme();

  const codeScope = (
    window.electronAPI.storeIpcRenderer.get("markdown_code_scope") as string
  )
    .split(",")
    .map((language) => language.trim());

  return (
    <Text
      size="xs"
      className={clsx(
        "ml-4 mr-2",
        msg.inPrompts &&
          (colorScheme === "light" ? "text-gray-900" : "text-dark-100"),
        !msg.inPrompts &&
          (colorScheme === "light" ? "text-gray-500" : "text-dark-400"),
        msg.sender === "user" && "whitespace-pre-wrap"
      )}
    >
      {msg.sender === "assistant" ? (
        <Markdown
          text={msg[msgKey]}
          codeScope={codeScope}
          colorScheme={colorScheme}
        />
      ) : (
        <p>{msg[msgKey]}</p>
      )}
    </Text>
  );
};

export default memo(MessageItem);
