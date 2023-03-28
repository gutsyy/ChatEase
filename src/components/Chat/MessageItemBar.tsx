import { Button, clsx, Tooltip } from "@mantine/core";
import {
  IconArrowBarDown,
  IconArrowBarUp,
  IconCloud,
  IconCloudOff,
  IconTrash,
  TablerIconsProps,
} from "@tabler/icons-react";
import { forwardRef, LegacyRef, useEffect, useState } from "react";
import { Prompt } from "../../database/models/Prompt";
import { Message } from "../../database/models/Message";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  clearMessageActionResultByIndex,
  setMessageActionResultByIndex,
  toggleMessagePrompt,
} from "../../reducers/chatSlice";
import { requestPromptApi } from "../../services/openAI/apiConfig";
import { setActionId } from "../../reducers/promptSlice";

interface ActionIconButtonProps {
  icon: (props: TablerIconsProps) => JSX.Element;
  onClick: () => void;
  tooltip: string;
}

const ActionIconButton = ({
  icon: Icon,
  onClick,
  tooltip,
}: ActionIconButtonProps) => (
  <div
    className="ml-2 flex justify-center items-center"
    onClick={() => {
      onClick();
    }}
  >
    <Tooltip
      styles={{
        tooltip: {
          fontSize: "12px",
        },
      }}
      label={tooltip}
      withArrow
    >
      <Icon className="text-gray-500" size={14} />
    </Tooltip>
  </div>
);

const withIconStyle = (
  icon: (props: TablerIconsProps) => JSX.Element,
  setProps: TablerIconsProps
) => {
  const Icon = icon;
  return forwardRef(
    (props: TablerIconsProps, ref: LegacyRef<SVGSVGElement>) => (
      <Icon {...props} {...setProps} ref={ref} />
    )
  );
};

const MessageItemBar = ({
  msg,
  index,
  onDelete,
  expanded,
  onToggleExpanded,
  actionId,
}: {
  msg: Message;
  index: number;
  expanded: boolean;
  onDelete: () => void;
  onToggleExpanded: () => void;
  actionId: string;
}) => {
  const dispatch = useAppDispatch();

  const renderTime = (
    <div
      className={clsx(
        "text-xs",
        msg.inPrompts && "text-gray-500",
        !msg.inPrompts && "text-gray-300"
      )}
    >
      {new Date(msg.timestamp * 1000).toLocaleTimeString()}
    </div>
  );

  const actionsDefine: ActionIconButtonProps[] = [
    {
      icon: expanded
        ? withIconStyle(IconArrowBarUp, { className: "text-gray-500" })
        : withIconStyle(IconArrowBarDown, { className: "text-blue-500" }),
      onClick: () => onToggleExpanded(),
      tooltip: expanded ? "collapse" : "expand",
    },
    {
      icon: msg.inPrompts
        ? withIconStyle(IconCloud, { className: "text-blue-500" })
        : withIconStyle(IconCloudOff, { className: "text-gray-500" }),
      onClick: () => dispatch(toggleMessagePrompt(index)),
      tooltip: `${msg.inPrompts ? "In" : "Not in"} promps`,
    },
    {
      icon: withIconStyle(IconTrash, { className: "text-red-500" }),
      onClick: () => onDelete(),
      tooltip: "Delete",
    },
  ];

  const renderActions = (
    <>
      {actionsDefine.map((action, i) => (
        <ActionIconButton key={i} {...action} />
      ))}
    </>
  );

  const renderTokensCount = (
    <>
      {msg.inPrompts ? (
        <div className="text-xs text-white px-1 ml-2 rounded bg-green-500 mr-1">{`${window.electronAPI.othersIpcRenderer.calMessagesTokens(
          [
            {
              role: msg.sender,
              content: msg.text,
            },
          ],
          true
        )} tokens in prompt`}</div>
      ) : (
        <div className="text-xs text-white px-1 ml-2 rounded bg-gray-300 mr-1">{`${window.electronAPI.othersIpcRenderer.calMessagesTokens(
          [
            {
              role: msg.sender,
              content: msg.text,
            },
          ],
          true
        )} tokens`}</div>
      )}
    </>
  );

  const [actionItems, setActionItems] = useState<Prompt[]>([]);

  useEffect(() => {
    window.electronAPI.databaseIpcRenderer
      .getPromptsByIds(
        window.electronAPI.storeIpcRenderer.get(
          "message_toolbar_items"
        ) as number[]
      )
      .then((prompts) => {
        setActionItems(prompts);
      });
  }, []);

  const [runningActionName, setRunningActionName] = useState("");

  const handleActionClick = (prompt: Prompt, message: string) => {
    dispatch(setActionId(actionId));
    setRunningActionName(prompt.name);
    dispatch(clearMessageActionResultByIndex(index));
    requestPromptApi(prompt, message);
  };

  const answerContent = useAppSelector((state) => state.prompt.answerContent);
  const runningActionId = useAppSelector((state) => state.prompt.actionId);
  const isPromptResponsing = useAppSelector(
    (state) => state.prompt.isPromptResponsing
  );

  if (!isPromptResponsing) {
    if (runningActionName) {
      setRunningActionName("");
    }
  }

  useEffect(() => {
    if (answerContent && runningActionId === actionId) {
      dispatch(
        setMessageActionResultByIndex({
          index,
          text: answerContent,
        })
      );
    }
  }, [answerContent, runningActionId]);

  return (
    <div className="flex-1 flex justify-between items-center">
      <div className="flex items-center">
        <>{renderTime}</>
        <>{renderTokensCount}</>
      </div>
      <div className="flex">
        <div className="flex gap-1">
          {actionItems.map((item, i) => (
            <Tooltip
              label={item.description}
              key={i}
              styles={{ tooltip: { fontSize: "12px" } }}
              withArrow
            >
              <Button
                styles={{
                  root: {
                    paddingLeft: "0.5rem",
                    paddingRight: "0.5rem",
                  },
                }}
                loading={
                  isPromptResponsing &&
                  runningActionId === actionId &&
                  runningActionName === item.name
                }
                disabled={
                  (isPromptResponsing && runningActionId !== actionId) ||
                  (runningActionName !== item.name &&
                    Boolean(runningActionName))
                }
                size="xs"
                variant="subtle"
                className="font-greycliff h-5"
                onClick={() => {
                  handleActionClick(item, msg.text);
                }}
              >
                {item.name}
              </Button>
            </Tooltip>
          ))}
        </div>
        <div className="flex">{renderActions}</div>
      </div>
    </div>
  );
};

export default MessageItemBar;
