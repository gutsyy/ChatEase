import { ActionIcon, Button, clsx, Popover, Tooltip } from "@mantine/core";
import {
  IconArrowBarDown,
  IconArrowBarUp,
  IconClipboardCopy,
  IconCloud,
  IconCloudOff,
  IconEye,
  IconPin,
  IconPinnedOff,
  IconTrash,
  TablerIconsProps,
} from "@tabler/icons-react";
import {
  forwardRef,
  MutableRefObject,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Prompt } from "../../database/models/Prompt";
import { Message } from "../../database/models/Message";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  clearMessageActionResultByIndex,
  setMessageActionResultByIndex,
  toggleMesageFixedInPrompt,
  toggleMessagePrompt,
} from "../../reducers/chatSlice";
import { requestPromptApi } from "../../services/openAI/apiConfig";
import { setActionId } from "../../reducers/promptSlice";
import { useDisclosure } from "@mantine/hooks";
import { RenderContent } from "./MessageItem";
import { useTranslation } from "react-i18next";

interface MessageItemBarProps {
  msg: Message;
  index: number;
  expanded: boolean;
  onDelete: () => void;
  onToggleExpanded: () => void;
  actionId: string;
}
const MessageItemBar = ({
  msg,
  index,
  onDelete,
  expanded,
  onToggleExpanded,
  actionId,
}: MessageItemBarProps) => {
  const dispatch = useAppDispatch();
  const [actionItems, setActionItems] = useState<Prompt[]>([]);
  const [runningActionName, setRunningActionName] = useState("");
  const answerContent = useAppSelector((state) => state.prompt.answerContent);
  const runningActionId = useAppSelector((state) => state.prompt.actionId);
  const { t } = useTranslation();
  const isPromptResponsing = useAppSelector(
    (state) => state.prompt.isPromptResponsing
  );
  const actionsDefine: RenderActionButtonProps[] = useMemo(
    () => [
      {
        icon: withIconStyle(IconClipboardCopy, {
          className: "text-violet-500",
        }),
        onClick: () => {
          navigator.clipboard.writeText(msg.text);
        },
        tooltip: t("message_actions_rawCopy"),
      },
      {
        icon: expanded
          ? withIconStyle(IconArrowBarUp, { className: "text-gray-400" })
          : withIconStyle(IconArrowBarDown, { className: "text-violet-500" }),
        onClick: () => onToggleExpanded(),
        tooltip: expanded ? t("collapse") : t("expand"),
      },
      {
        icon: msg.fixedInPrompt
          ? withIconStyle(IconPinnedOff, { className: "text-gray-500" })
          : withIconStyle(IconPin, { className: "text-violet-500" }),
        onClick: () =>
          dispatch(toggleMesageFixedInPrompt({ index, id: msg.id })),
        tooltip: msg.fixedInPrompt
          ? t("message_actions_unPin")
          : t("message_actions_pin"),
      },
      {
        disabled: msg.fixedInPrompt,
        icon: msg.inPrompts
          ? withIconStyle(IconCloud, {
              className: msg.fixedInPrompt
                ? "text-gray-400"
                : "text-violet-500",
            })
          : withIconStyle(IconCloudOff, { className: "text-gray-400" }),
        onClick: () => dispatch(toggleMessagePrompt(index)),
        tooltip: msg.fixedInPrompt
          ? t("message_actions_promptToggleButtonDisable")
          : `${
              msg.inPrompts
                ? t("message_actions_removePrompt")
                : t("message_actions_addPrompt")
            }`,
      },
      {
        icon: withIconStyle(IconTrash, { className: "text-red-500" }),
        onClick: () => onDelete(),
        tooltip: t("message_actions_delete"),
      },
    ],
    [expanded, msg.inPrompts, msg.fixedInPrompt, t]
  );

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

  const handleActionClick = (prompt: Prompt, message: string) => {
    dispatch(setActionId(actionId));
    setRunningActionName(prompt.name);
    dispatch(clearMessageActionResultByIndex(index));
    requestPromptApi(prompt, message);
  };

  const renderActions = (
    <>
      {actionsDefine.map((action, i) => (
        <RenderActionButton key={i} {...action} />
      ))}
    </>
  );

  if (!isPromptResponsing) {
    if (runningActionName) {
      setRunningActionName("");
    }
  }

  return (
    <div className="flex-1 flex justify-between items-center">
      <div className="flex items-center">
        <RenderTime {...msg} />
        <RenderTokensCount {...msg} />
        {!expanded && <RenderPreviewButton {...msg} />}
      </div>
      <div className="flex">
        <div
          className="flex gap-1 overflow-x-auto"
          style={{ maxWidth: "240px" }}
        >
          {actionItems.map((item, i) => (
            <Tooltip
              label={item.description}
              key={i}
              styles={{ tooltip: { fontSize: "12px" } }}
              withArrow
              openDelay={1000}
            >
              <Button
                color="violet"
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

interface RenderActionButtonProps {
  icon: (props: TablerIconsProps) => JSX.Element;
  onClick: () => void;
  tooltip: string;
  disabled?: boolean;
}

const RenderActionButton = ({
  icon: Icon,
  onClick,
  tooltip,
  disabled = false,
}: RenderActionButtonProps) => (
  <Tooltip
    styles={{
      tooltip: {
        fontSize: "12px",
      },
    }}
    openDelay={1000}
    label={tooltip}
    withArrow
  >
    <div className="ml-2 flex justify-center items-center">
      <ActionIcon
        size="xs"
        color="violet"
        disabled={disabled}
        onClick={onClick}
      >
        <Icon className="text-gray-500" size={14} />
      </ActionIcon>
    </div>
  </Tooltip>
);

const RenderTime = (msg: Message) => {
  return (
    <div
      className={clsx(
        "text-xs italic",
        msg.inPrompts && "text-gray-400",
        !msg.inPrompts && "text-gray-300"
      )}
    >
      {new Date(msg.timestamp * 1000).toLocaleTimeString()}
    </div>
  );
};

const RenderTokensCount = (msg: Message) => {
  return (
    <div
      className={clsx(
        "text-xs px-1 ml-3 rounded-sm mr-1 font-greycliff",
        msg.inPrompts
          ? "bg-violet-100 text-violet-500"
          : "bg-gray-200 text-white"
      )}
    >{`${window.electronAPI.othersIpcRenderer.calMessagesTokens(
      [
        {
          role: msg.sender,
          content: msg.text,
        },
      ],
      true
    )} tokens`}</div>
  );
};

const RenderPreviewButton = (msg: Message) => {
  const [opened, { close, open }] = useDisclosure(false);

  return (
    <Popover
      width={500}
      position="bottom-start"
      withArrow
      shadow="md"
      opened={opened}
      radius="md"
    >
      <Popover.Target>
        <ActionIcon
          className="ml-1"
          size="xs"
          onMouseEnter={open}
          onMouseLeave={close}
        >
          <IconEye size={14} className="text-violet-500" />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <div style={{ maxHeight: "280px" }} className="overflow-hidden">
          <RenderContent msg={msg} msgKey={"text"} />
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};

const withIconStyle = (
  icon: (props: TablerIconsProps) => JSX.Element,
  setProps: TablerIconsProps
) => {
  const Icon = icon;
  return forwardRef(
    (props: TablerIconsProps, ref: MutableRefObject<SVGSVGElement>) => (
      <Icon {...props} {...setProps} ref={ref} />
    )
  );
};

export default MessageItemBar;
