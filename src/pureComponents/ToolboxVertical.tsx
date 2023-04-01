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

export const ToolboxVertical = memo(
  ({
    items,
    keepClicked = true,
    defaultSelected = -1,
  }: {
    items: ToolboxVerticalItem[];
    keepClicked?: boolean;
    defaultSelected?: number;
  }) => {
    const [selected, setSelected] = useState<number>(defaultSelected);
    const { colorScheme } = useMantineTheme();

    const onItemClick = (key: number) => {
      if (keepClicked) {
        setSelected(key);
      }
      items[key].onClick();
    };

    return (
      <div className="flex-col">
        {items.map((item, i) => (
          <SettedTooltip key={i} label={item.tooltip}>
            <div
              className={clsx(
                "p-1 px-2 flex justify-center items-center my-2",
                colorScheme === "dark" && "hover:text-dark-100",
                selected === i &&
                  colorScheme === "light" &&
                  "text-gray-700 border-0 border-solid border-l border-violet-600 hover:text-gray-700",
                selected === i && colorScheme === "dark" && "text-white"
              )}
              onClick={() => onItemClick(i)}
            >
              {iconSetProps(item.icon)}
            </div>
          </SettedTooltip>
        ))}
      </div>
    );
  }
);
