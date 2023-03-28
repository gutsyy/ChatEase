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

export const SideNav = () => {
  const dispatch = useAppDispatch();

  const topItems: ToolboxVerticalItem[] = [
    {
      name: "Have chats with GPT3.5",
      tooltip: "Chatting with ChatGPT",
      icon: IconMessageCircle2,
      onClick: () => {
        dispatch(setMode("chat"));
      },
    },
    {
      name: "Prompt Action Library",
      tooltip: "Get answers with prompt",
      icon: IconPrompt,
      onClick: () => {
        dispatch(setMode("action"));
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
      onClick: () => dispatch(toggleSideNavExpanded()),
      tooltip: sideNavExpanded ? "收起" : "展开",
    },
  ];

  return (
    <div className="flex flex-col justify-between bg-white text-gray-400 border-solid border-0 border-r border-gray-200">
      <ToolboxVertical items={topItems} defaultSelected={0}></ToolboxVertical>
      <ToolboxVertical items={bottomItems} keepClicked={false} />
    </div>
  );
};
