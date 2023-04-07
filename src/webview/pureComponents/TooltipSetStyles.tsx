import { Tooltip, TooltipProps } from "@mantine/core";

export const TooltipSetStyles = (props: TooltipProps & { size?: "md" }) => {
  return (
    <Tooltip
      {...props}
      withArrow
      styles={{
        tooltip: {
          fontSize: props.size === "md" ? "14px" : "12px",
        },
      }}
    ></Tooltip>
  );
};
