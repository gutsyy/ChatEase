import { ActionIcon, clsx, useMantineTheme } from "@mantine/core";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import { IconPin, IconX } from "@tabler/icons-react";
import { Message } from "../../database/models/Message";
import MessageItem from "./MessageItem";

export const PinnedMessages = ({ messages }: { messages: Message[] }) => {
  const { colorScheme } = useMantineTheme();
  const [opened, { open, close }] = useDisclosure(false);
  const ref = useClickOutside<HTMLDivElement>(() => null);

  const pinnedMessages: { msg: Message; index: number }[] = messages.reduce(
    (pms, msg, index) => {
      if (msg.fixedInPrompt) {
        return [...pms, { msg: msg, index: index }];
      } else {
        return [...pms];
      }
    },
    []
  );

  return (
    <>
      <div className="sticky w-full top-1 z-50 bg-transparent mb-2 transition-all ease-in">
        <div className="flex justify-center">
          <div
            className={clsx(
              "text-xs px-4 py-1 shadow-md transition-all ease-in-out duration-500 gap-2 hover:cursor-pointer shadow-dark-300 overflow-x-hidden relative justify-center",
              colorScheme === "dark"
                ? "bg-dark-800 shadow-dark-700"
                : "bg-gray-50 shadow-gray-300",
              opened && "w-full max-h-64 mx-3 items-start overflow-y-auto",
              !opened && "w-44 overflow-y-hidden max-h-6",
              //   pinnedMessages.length && "",
              !pinnedMessages.length && "max-h-0 h-0 shadow-none opacity-0"
            )}
            style={{
              borderRadius: "1rem",
            }}
            onClick={open}
            ref={ref}
          >
            <div
              className={clsx(
                "flex gap-2 justify-center items-center font-bold font-greycliff sticky w-full top-0 z-50",
                colorScheme === "dark" ? "text-dark-100" : "text-violet-500"
              )}
            >
              <IconPin size={14} />
              <div>Pinned Messages</div>
              {opened && (
                <ActionIcon
                  size="xs"
                  color="violet"
                  onClick={(e) => {
                    e.stopPropagation();
                    ref.current.scrollTo({ top: 0, behavior: "smooth" });
                    close();
                  }}
                >
                  <IconX
                    className={clsx(
                      colorScheme === "dark"
                        ? "text-dark-200"
                        : "text-violet-500"
                    )}
                    size={14}
                  />
                </ActionIcon>
              )}
            </div>
            <div className="w-full mt-3 flex-1">
              {pinnedMessages.length === 0 && (
                <div className="w-full mt-32 flex justify-center items-center">
                  No Pinned Messages
                </div>
              )}
              {pinnedMessages.map((msg) => (
                <MessageItem key={msg.msg.id} msg={msg.msg} index={msg.index} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
