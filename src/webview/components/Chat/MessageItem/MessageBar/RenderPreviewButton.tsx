import { useMantineTheme, Popover, ActionIcon } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEye } from "@tabler/icons-react";
import MessageContent, { MessageContentProps } from "../MessageContent";
import { memo } from "react";

type RenderPreviewButtonProps = MessageContentProps;

const RenderPreviewButton = (msg: RenderPreviewButtonProps) => {
  const [opened, { close, open }] = useDisclosure(false);
  const { colorScheme } = useMantineTheme();

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
          <IconEye
            size={14}
            className={
              colorScheme === "dark" ? "text-white" : "text-violet-500"
            }
          />
        </ActionIcon>
      </Popover.Target>
      <Popover.Dropdown>
        <div style={{ maxHeight: "280px" }} className="overflow-hidden">
          <MessageContent {...msg} />
        </div>
      </Popover.Dropdown>
    </Popover>
  );
};

export default memo(RenderPreviewButton);
