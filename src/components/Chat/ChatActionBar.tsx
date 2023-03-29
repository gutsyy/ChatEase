import { Button } from "@mantine/core";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../hooks/redux";
import { Prompt } from "../../database/models/Prompt";

export const ChatActionBar = ({
  visible,
  onClick,
}: {
  visible: boolean;
  onClick: (prompt: Prompt) => boolean;
}) => {
  const [runningActionId, setRunningActionId] = useState(-1);

  const [actions, setActions] = useState<Prompt[]>([]);

  const actionId = useAppSelector((state) => state.prompt.actionId);

  useEffect(() => {
    if (actionId !== "chat-action" && runningActionId !== -1) {
      setRunningActionId(-1);
    }
  }, [actionId]);

  useEffect(() => {
    const actionIds = window.electronAPI.storeIpcRenderer.get(
      "message_toolbar_items"
    ) as number[];
    window.electronAPI.databaseIpcRenderer
      .getPromptsByIds(actionIds)
      .then((prompts) => {
        setActions(prompts);
      });
  }, []);

  return (
    <div
      className={clsx(
        "bg-white border-solid border-0 border-t border-gray-200 gap-1 w-full flex items-center justify-center px-4 transition-all ease-linear duration-100 overflow-y-hidden",
        visible ? "h-8 py-1 opacity-100" : "h-0 py-0 opacity-0"
      )}
    >
      {actions.map((item, i) => (
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
  );
};
