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

  return (
    <div
      className="h-full bg-gray-200 py-1 transition-all overflow-hidden"
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
