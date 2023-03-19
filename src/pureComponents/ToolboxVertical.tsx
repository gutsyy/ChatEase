import { Tooltip, TooltipProps } from "@mantine/core";
import { TablerIconsProps } from "@tabler/icons-react";
import { memo, useState } from "react";

export type ToolboxVerticalItem = {
  tooltip: string;
  name: string;
  icon: (props: TablerIconsProps) => JSX.Element;
  onClick: () => void;
};

const iconSetProps = (Component: (props: TablerIconsProps) => JSX.Element) => {
  return <Component strokeWidth={1} />;
};

const SettedTooltip = (props: TooltipProps) => {
  return (
    <Tooltip color="gray" offset={10} position="right" {...props}></Tooltip>
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

    const onItemClick = (key: number) => {
      if (keepClicked) {
        setSelected(key);
      }
      items[key].onClick();
    };

    return (
      <div className="flex-col  ">
        {items.map((item, i) => (
          <SettedTooltip key={i} label={item.name}>
            <div
              className={
                "p-1 hover:text-white hover:bg-gray-600 flex justify-center items-center rounded my-2 " +
                (selected === i && "bg-gray-500 shadow text-white")
              }
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
