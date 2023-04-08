import { IconPin, IconX } from "@tabler/icons-react";
import { Message } from "@/database/models/Message";
import {
  ActionIcon,
  clsx,
  Collapse,
  Divider,
  rem,
  useMantineTheme,
} from "@mantine/core";
import { memo, useCallback, useMemo, useRef } from "react";
import { useAppDispatch } from "../../../hooks/redux";
import {
  setMessageActionResultByIndex,
  toggleMessageCollapse,
  updateMessages,
} from "@/webview/reducers/chatSlice";
import { v4 } from "uuid";
import MessageContent from "./MessageContent";
import StopGenerationButton from "./StopGenerationButton";
import MessageBar from "./MessageBar";

interface MessageItemProps extends Message {
  index: number;
  onPinnedMessageBox?: boolean;
}

const MessageItem = ({
  index,
  onPinnedMessageBox = false,
  ...msg
}: MessageItemProps) => {
  const dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const actionId = useMemo(() => v4(), [msg.id]);
  const { colorScheme } = useMantineTheme();

  const onDelete = useCallback(() => {
    if (containerRef.current && contentRef.current) {
      containerRef.current.style.maxHeight = `${
        contentRef.current.clientHeight + rem(1)
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
      {msg.fixedInPrompt && !onPinnedMessageBox && (
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
        <MessageBar
          index={index}
          actionId={actionId}
          onDelete={onDelete}
          expanded={!msg.collapse}
          onToggleExpanded={() => onToggleCollapse()}
          {...msg}
        />
        <Collapse
          in={!msg.collapse}
          transitionDuration={200}
          transitionTimingFunction="ease-out"
        >
          <div className="overflow-x-auto">
            <MessageContent {...msg} />
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
                <MessageContent {...msg} isActionResult={true} />
              </>
            )}
          </div>
        </Collapse>
        <StopGenerationButton actionId={actionId} />
      </div>
    </div>
  );
};

export default memo(MessageItem);
