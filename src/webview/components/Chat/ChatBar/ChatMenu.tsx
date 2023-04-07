import { useAppDispatch } from "@/webview/hooks/redux";
import {
  setShareImageDialog,
  collapseAllMessages,
  setAllMessageInPromptsToFalse,
  recalMessages,
} from "@/webview/reducers/chatSlice";
import { useMantineTheme, ActionIcon, Menu, clsx } from "@mantine/core";
import {
  IconMenu2,
  IconShare3,
  IconArrowBarDown,
  IconArrowBarUp,
  IconCloudOff,
  IconCalculator,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

const ChatMenu = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { colorScheme } = useMantineTheme();

  return (
    <Menu shadow="md" position="top-start" radius="md">
      <Menu.Target>
        <ActionIcon
          variant="filled"
          size="md"
          radius="lg"
          color={colorScheme === "dark" ? "dark" : ""}
        >
          <IconMenu2
            size={16}
            className={clsx(
              colorScheme === "dark" ? "text-dark-100" : "text-white"
            )}
          />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown
        className={clsx(colorScheme === "dark" && "bg-dark-900 border-0")}
      >
        <Menu.Item
          className="text-xs"
          icon={<IconShare3 size={12} />}
          onClick={() => dispatch(setShareImageDialog(true))}
        >
          {t("chat_menu_share")}
        </Menu.Item>
        <Menu.Item
          className="text-xs"
          icon={<IconArrowBarDown size={12} />}
          onClick={() => dispatch(collapseAllMessages(false))}
        >
          {t("chat_menu_expandAll")}
        </Menu.Item>
        <Menu.Item
          className="text-xs"
          icon={<IconArrowBarUp size={12} />}
          onClick={() => dispatch(collapseAllMessages(true))}
        >
          {t("chat_menu_collapseAll")}
        </Menu.Item>
        <Menu.Item
          className="text-xs"
          icon={<IconCloudOff size={12} />}
          onClick={() => dispatch(setAllMessageInPromptsToFalse())}
        >
          {t("chat_menu_removeAll")}
        </Menu.Item>
        <Menu.Item
          className="text-xs"
          icon={<IconCalculator size={12} />}
          onClick={() => dispatch(recalMessages())}
        >
          {t("chat_menu_recalulator")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ChatMenu;
