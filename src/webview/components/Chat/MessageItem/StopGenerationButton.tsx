import { Button } from "@mantine/core";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { setPromptIsResponsing } from "../../../reducers/promptSlice";
import { memo } from "react";

const StopGenerationButton = ({ actionId }: { actionId: string }) => {
  const dispatch = useAppDispatch();
  const runningActionId = useAppSelector((state) => state.prompt.actionId);
  const isPromptResponsing = useAppSelector(
    (state) => state.prompt.isPromptResponsing
  );

  return (
    <>
      {runningActionId === actionId && isPromptResponsing && (
        <div className="sticky w-full flex bg-transparent justify-center bottom-0">
          <Button
            size="xs"
            color="violet"
            radius="lg"
            className="h-6"
            variant="light"
            onClick={() => {
              dispatch(setPromptIsResponsing(false));
            }}
          >
            Stop Generation
          </Button>
        </div>
      )}
    </>
  );
};

export default memo(StopGenerationButton);
