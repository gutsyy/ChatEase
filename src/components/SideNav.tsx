import {
  IconLayoutSidebarLeftCollapse,
  IconLayoutSidebarLeftExpand,
  IconMessageCircle2,
  IconPrompt,
  IconSettings,
} from "@tabler/icons-react";
import { setSelectedMode, toggleSideNav } from "../reducers/app";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import {
  ToolboxVertical,
  ToolboxVerticalItem,
} from "../pureComponents/ToolboxVertical";
import { openSettingsModal } from "./modals/settings";

export const SideNav = () => {
  const dispatch = useAppDispatch();

  const topItems: ToolboxVerticalItem[] = [
    {
      name: "Have chats with GPT3.5",
      tooltip: "Chatting with ChatGPT",
      icon: IconMessageCircle2,
      onClick: () => {
        dispatch(setSelectedMode("chat"));
      },
    },
    {
      name: "Prompt Action Library",
      tooltip: "Get answers with prompt",
      icon: IconPrompt,
      onClick: () => {
        dispatch(setSelectedMode("prompt"));
      },
    },
  ];

  const sideNavExpanded = useAppSelector((state) => state.app.sideNavExpanded);

  const bottomItems: ToolboxVerticalItem[] = [
    {
      name: "设置",
      icon: IconSettings,
      onClick: () => openSettingsModal(),
      tooltip: "App Settings",
    },
    {
      name: sideNavExpanded ? "收起" : "展开",
      icon: sideNavExpanded
        ? IconLayoutSidebarLeftCollapse
        : IconLayoutSidebarLeftExpand,
      onClick: () => dispatch(toggleSideNav()),
      tooltip: sideNavExpanded ? "收起" : "展开",
    },
  ];

  return (
    <div className="px-1 flex flex-col justify-between bg-gray-700 text-white">
      <ToolboxVertical items={topItems} defaultSelected={0}></ToolboxVertical>
      <ToolboxVertical items={bottomItems} keepClicked={false} />
    </div>
  );
};
