import {
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconMessageCircle2,
  IconPrompt,
  IconSettings,
} from "@tabler/icons-react";
import { setMode, toggleSideNavExpanded } from "../reducers/appSlice";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  ToolboxVertical,
  ToolboxVerticalItem,
} from "../pureComponents/ToolboxVertical";
import { openSettingsModal } from "./modals/settings";
import { useTranslation } from "react-i18next";
import { clsx, useMantineTheme } from "@mantine/core";

export const SideNav = () => {
  const dispatch = useAppDispatch();
  const sideNavExpanded = useAppSelector((state) => state.app.sideNavExpanded);
  const { t } = useTranslation();
  const { colorScheme } = useMantineTheme();

  const topItems: ToolboxVerticalItem[] = [
    {
      name: "Have chats with GPT3.5",
      tooltip: t("sideNav_chat_tooltip"),
      icon: IconMessageCircle2,
      onClick: () => {
        dispatch(setMode("chat"));
      },
    },
    {
      name: "Prompt Action Library",
      tooltip: t("sideNav_prompt_tooltip"),
      icon: IconPrompt,
      onClick: () => {
        dispatch(setMode("action"));
      },
    },
  ];

  const bottomItems: ToolboxVerticalItem[] = [
    {
      name: "Settings",
      icon: IconSettings,
      onClick: () => openSettingsModal(),
      tooltip: t("sideNav_settings_tooltip"),
    },
    {
      name: "Expand/Collapse",
      icon: sideNavExpanded
        ? IconLayoutSidebarLeftCollapse
        : IconLayoutSidebarLeftExpand,
      onClick: () => dispatch(toggleSideNavExpanded()),
      tooltip: sideNavExpanded ? t("collapse") : t("expand"),
    },
  ];

  return (
    <div
      className={clsx(
        "flex flex-col justify-between border-solid border-0 border-r",
        colorScheme === "dark"
          ? "bg-dark-800 border-dark-800 text-dark-300"
          : "bg-white text-gray-400 border-gray-200"
      )}
    >
      <ToolboxVertical items={topItems} defaultSelected={0}></ToolboxVertical>
      <ToolboxVertical items={bottomItems} keepClicked={false} />
    </div>
  );
};
