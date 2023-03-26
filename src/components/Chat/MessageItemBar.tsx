import { clsx, Tooltip } from "@mantine/core";
import {
  IconArrowBarDown,
  IconArrowBarUp,
  IconCloud,
  IconCloudOff,
  IconTrash,
  TablerIconsProps,
} from "@tabler/icons-react";
import { forwardRef, LegacyRef, Ref } from "react";
import { Message } from "../../database/models/Message";
import { useAppDispatch } from "../../hooks/redux";
import { toggleMessagePrompt } from "../../reducers/chatSlice";

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
}: {
  msg: Message;
  index: number;
  expanded: boolean;
  onDelete: () => void;
  onToggleExpanded: () => void;
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

  return (
    <div className="flex-1 flex justify-between items-center">
      <div className="flex items-center">
        <>{renderTime}</>
        <>{renderTokensCount}</>
      </div>
      <div className="flex">{renderActions}</div>
    </div>
  );
};

export default MessageItemBar;
