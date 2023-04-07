import { Tooltip, ActionIcon } from "@mantine/core";
import { TablerIconsProps } from "@tabler/icons-react";
import { memo } from "react";

export interface RenderActionButtonProps {
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
        fontSize: "0.75rem",
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

export default memo(RenderActionButton);
