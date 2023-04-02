import { useMantineTheme } from "@mantine/core";
import clsx from "clsx";
import { useAppSelector } from "../hooks/redux";
import { ChatHistory } from "./ChatHistory/ChatHistory";
import { PromptsList } from "./Prompt/PromptsList";

const renderBoxByModuleSelected = (selectedMode: string) => {
  if (selectedMode === "chat") {
    return <ChatHistory />;
  }

  if (selectedMode === "action") {
    return <PromptsList />;
  }
};

export const SideExtend = () => {
  const selectedMode = useAppSelector((state) => state.app.selectedAppModule);

  const sideNavExpanded = useAppSelector((state) => state.app.sideNavExpanded);

  const { colorScheme } = useMantineTheme();

  return (
    <div
      className={clsx(
        "h-full py-1 transition-all overflow-hidden border-solid border-0 border-r",
        colorScheme === "light" && "bg-gray-100 border-gray-200",
        colorScheme === "dark" && "bg-dark-750 border-dark-750"
      )}
      style={{
        width: sideNavExpanded ? "256px" : "0px",
        paddingLeft: sideNavExpanded ? "0.25rem" : "",
        paddingRight: sideNavExpanded ? "0.25rem" : "",
        opacity: sideNavExpanded ? "1" : "0",
      }}
    >
      {renderBoxByModuleSelected(selectedMode)}
    </div>
  );
};
