import { useAppSelector } from "../../hooks/redux";
import ChatStatistics from "./ChatStatistics";
import { RenderStopGenerationButton } from "./StopGenerationButton";

interface ChatBottomStatusBarProps {
  messagesInPromptsNum: number;
}

export const ChatBottomStatusBar = ({
  messagesInPromptsNum,
}: ChatBottomStatusBarProps) => {
  const isWaitingRes = useAppSelector((state) => state.chat.isWaitingRes);
  const isResponsing = useAppSelector((state) => state.chat.isResponsing);

  return (
    <>
      {isWaitingRes || isResponsing ? (
        <RenderStopGenerationButton />
      ) : (
        <ChatStatistics
          messagesInPromptsNum={messagesInPromptsNum}
        ></ChatStatistics>
      )}
    </>
  );
};
