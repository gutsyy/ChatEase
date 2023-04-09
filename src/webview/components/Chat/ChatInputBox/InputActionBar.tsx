import { Button, useMantineTheme, clsx } from "@mantine/core";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks/redux";
import { Prompt } from "@/database/models/Prompt";

interface ChatActionBarProps {
  visible: boolean;
  onClick: (prompt: Prompt) => boolean;
}

export const InputActionBar = ({ visible, onClick }: ChatActionBarProps) => {
  const [runningActionId, setRunningActionId] = useState(-1);
  const actionId = useAppSelector((state) => state.prompt.actionId);
  const { colorScheme } = useMantineTheme();
  const actionsId = useAppSelector(
    (state) => state.settings.chat_input_toolbar_items
  );
  const [promptActions, setPromptActions] = useState<Prompt[]>([]);

  useEffect(() => {
    if (actionId !== "chat-action" && runningActionId !== -1) {
      setRunningActionId(-1);
    }
  }, [actionId]);

  useEffect(() => {
    window.electronAPI.databaseIpcRenderer
      .getPromptsByIds(actionsId)
      .then((p) => {
        setPromptActions(p);
      });
  }, [actionsId]);

  return (
    <>
      {actionsId.length !== 0 && (
        <div
          className={clsx(
            "border-solid border-0 border-t gap-1 w-full flex items-center justify-center px-4 transition-all ease-linear duration-100 overflow-y-hidden",
            visible ? "h-8 py-1 opacity-100" : "h-0 py-0 opacity-0",
            colorScheme === "dark"
              ? "bg-dark-800 border-dark-600 border-b"
              : "border-gray-200 bg-white"
          )}
        >
          {promptActions.map((item, i) => (
            <Button
              loading={runningActionId === item.id}
              key={i}
              className="font-greycliff h-6"
              radius="lg"
              size="xs"
              variant="gradient"
              gradient={{ from: "#9B30FF", to: "#DA70D6", deg: 90 }}
              onClick={() => {
                if (onClick(item)) {
                  setRunningActionId(item.id);
                }
              }}
            >
              {item.name}
            </Button>
          ))}
        </div>
      )}
    </>
  );
};
