import { Tooltip, TooltipProps } from "@mantine/core";

const TooltipSetStyles = (props: TooltipProps) => {
  return (
    <Tooltip
      withArrow
      openDelay={200}
      styles={{
        tooltip: {
          fontSize: "12px",
        },
      }}
      {...props}
    ></Tooltip>
  );
};

export default TooltipSetStyles;
