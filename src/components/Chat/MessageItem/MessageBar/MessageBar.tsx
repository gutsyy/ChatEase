import { Button, Tooltip, useMantineTheme } from "@mantine/core";
import {
  IconArrowBarDown,
  IconArrowBarUp,
  IconClipboardCopy,
  IconCloud,
  IconCloudOff,
  IconPin,
  IconPinnedOff,
  IconTrash,
  TablerIconsProps,
} from "@tabler/icons-react";
import {
  forwardRef,
  memo,
  MutableRefObject,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Prompt } from "@/database/models/Prompt";
import { Message } from "@/database/models/Message";
import { useAppDispatch, useAppSelector } from "@/hooks/redux";
import {
  clearMessageActionResultByIndex,
  setMessageActionResultByIndex,
  toggleMesageFixedInPrompt,
  toggleMessagePrompt,
} from "@/reducers/chatSlice";
import { requestPromptApi } from "@/services/openAI/apiConfig";
import { setActionId } from "@/reducers/promptSlice";
import { useTranslation } from "react-i18next";
import RenderTime from "./RenderTime";
import RenderActionBar, { RenderActionButtonProps } from "./RenderActionBar";
import RenderTokensCount from "./RenderTokensCount";
import RenderPreviewButton from "./RenderPreviewButton";
import RenderSender from "./RenderSender";

interface MessageBarProps extends Message {
  index: number;
  expanded: boolean;
  onDelete: () => void;
  onToggleExpanded: () => void;
  actionId: string;
}

const MessageBar = ({
  index,
  onDelete,
  expanded,
  onToggleExpanded,
  actionId,
  ...msg
}: MessageBarProps) => {
  const dispatch = useAppDispatch();
  const [actionItems, setActionItems] = useState<Prompt[]>([]);
  const [runningActionName, setRunningActionName] = useState("");
  const answerContent = useAppSelector((state) => state.prompt.answerContent);
  const runningActionId = useAppSelector((state) => state.prompt.actionId);
  const { t } = useTranslation();
  const isPromptResponsing = useAppSelector(
    (state) => state.prompt.isPromptResponsing
  );
  const { colorScheme } = useMantineTheme();

  const iconThemeColor =
    colorScheme === "dark" ? "text-dark-100" : "text-violet-500";

  const actionsDefine: RenderActionButtonProps[] = useMemo(
    () => [
      {
        icon: withIconStyle(IconClipboardCopy, {
          className: iconThemeColor,
        }),
        onClick: () => {
          navigator.clipboard.writeText(msg.text);
        },
        tooltip: t("message_actions_rawCopy"),
      },
      {
        icon: expanded
          ? withIconStyle(IconArrowBarUp, {
              className: "text-gray-400",
            })
          : withIconStyle(IconArrowBarDown, {
              className: iconThemeColor,
            }),
        onClick: () => onToggleExpanded(),
        tooltip: expanded ? t("collapse") : t("expand"),
      },
      {
        icon: msg.fixedInPrompt
          ? withIconStyle(IconPinnedOff, { className: "text-gray-500" })
          : withIconStyle(IconPin, { className: iconThemeColor }),
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
              className: msg.fixedInPrompt ? "text-gray-400" : iconThemeColor,
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
        icon: withIconStyle(IconTrash, { className: "text-red-400" }),
        onClick: () => onDelete(),
        tooltip: t("message_actions_delete"),
      },
    ],
    [expanded, msg.inPrompts, msg.fixedInPrompt, t, colorScheme]
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
        <RenderActionBar key={i} {...action} />
      ))}
    </>
  );

  if (!isPromptResponsing) {
    if (runningActionName) {
      setRunningActionName("");
    }
  }

  return (
    <div className="flex justify-start items-center w-full">
      <div className="flex-1 flex justify-between items-center">
        <div className="flex items-center">
          <RenderSender {...msg} />
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
                styles={{ tooltip: { fontSize: "0.75rem" } }}
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
                  <span className={iconThemeColor}>{item.name}</span>
                </Button>
              </Tooltip>
            ))}
          </div>
          <div className="flex">{renderActions}</div>
        </div>
      </div>
    </div>
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

export default memo(MessageBar);
