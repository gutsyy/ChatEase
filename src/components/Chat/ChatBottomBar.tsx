import { memo } from "react";
import { useAppSelector } from "../../hooks/redux";
import { RenderStopGenerationButton } from "./StopGenerationButton";
import ChatBar from "./ChatBar";

interface ChatBottomBar {
  messagesInPromptsNum: number;
}

export const ChatBottomBar = memo(({ messagesInPromptsNum }: ChatBottomBar) => {
  const isWaitingRes = useAppSelector((state) => state.chat.isWaitingRes);
  const isResponsing = useAppSelector((state) => state.chat.isResponsing);

  return (
    <>
      {isWaitingRes || isResponsing ? (
        <RenderStopGenerationButton />
      ) : (
        <ChatBar messagesInPromptsNum={messagesInPromptsNum}></ChatBar>
      )}
    </>
  );
});
