import Chat from "./Chat/Chat";
import { PromptPanel } from "./Prompt/PromptPanel";
import { useAppSelector } from "../hooks/redux";
import { SideExtend } from "./SideExtend";
import { SideNav } from "./SideNav";

export { Chat, SideExtend, SideNav };

export const MainPanel = () => {
  const selectedMode = useAppSelector((state) => state.app.selectedAppModule);

  if (selectedMode === "chat") {
    return <Chat />;
  } else {
    return <PromptPanel />;
  }
};
