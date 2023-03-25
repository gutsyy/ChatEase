import { Button } from "@mantine/core";
import { IconCircleX } from "@tabler/icons-react";
import { setIsResponsing, setNotiGenerate } from "../../reducers/chatSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useEffect } from "react";

export const RenderStopGenerationButton = () => {
  const dispatch = useAppDispatch();
  const isWaitingRes = useAppSelector((state) => state.chat.isWaitingRes);
  const isResponsing = useAppSelector((state) => state.chat.isResponsing);
  const notiStopGenerate = useAppSelector(
    (state) => state.chat.notiStopGenerate
  );

  useEffect(() => {
    if (notiStopGenerate) {
      setTimeout(() => {
        dispatch(setNotiGenerate(false));
      }, 200);
    }
  }, [notiStopGenerate]);

  if (isWaitingRes || isResponsing) {
    return (
      <div className="sticky w-40 z-50 bottom-0 -translate-x-1/2 left-1/2 bg-transparent">
        <Button
          className={
            notiStopGenerate
              ? "outline ouline-2 outline-red-400 shadow shadow-red-200 -bottom-px"
              : null
          }
          size="xs"
          fullWidth
          radius="lg"
          variant="light"
          color="red"
          leftIcon={<IconCircleX size={14} />}
          onClick={() => dispatch(setIsResponsing(false))}
        >
          Stop Generation
        </Button>
      </div>
    );
  }
  return null;
};
