import { clsx, TooltipProps, useMantineTheme } from "@mantine/core";
import { TablerIconsProps } from "@tabler/icons-react";
import { memo, useState } from "react";
import { TooltipSetStyles } from "./TooltipSetStyles";

export type ToolboxVerticalItem = {
  tooltip: string;
  name: string;
  icon: (props: TablerIconsProps) => JSX.Element;
  onClick: () => void;
};

const iconSetProps = (Component: (props: TablerIconsProps) => JSX.Element) => {
  return <Component strokeWidth={1.2} />;
};

const SettedTooltip = (props: TooltipProps) => {
  return (
    <TooltipSetStyles
      offset={10}
      position="right"
      {...props}
      openDelay={300}
    ></TooltipSetStyles>
  );
};

export interface ToolboxVerticalProps {
  items: ToolboxVerticalItem[];
  selectedField: keyof ToolboxVerticalItem;
  selectedValue?: string;
}

export const ToolboxVertical = memo(
  ({ items, selectedField, selectedValue }: ToolboxVerticalProps) => {
    const { colorScheme } = useMantineTheme();

    const onItemClick = (item: ToolboxVerticalItem) => {
      item.onClick();
    };

    return (
      <div className="flex-col">
        {items.map((item, i) => (
          <SettedTooltip key={i} label={item.tooltip}>
            <div
              className={clsx(
                "p-1 px-2 flex justify-center items-center my-2 hover:cursor-pointer",
                colorScheme === "dark" && "hover:text-dark-100",
                item[selectedField] === selectedValue &&
                  colorScheme === "light" &&
                  "text-gray-700 border-0 border-solid border-l border-violet-600 hover:text-gray-700",
                item[selectedField] === selectedValue &&
                  colorScheme === "dark" &&
                  "text-white"
              )}
              onClick={() => onItemClick(item)}
            >
              {iconSetProps(item.icon)}
            </div>
          </SettedTooltip>
        ))}
      </div>
    );
  }
);
