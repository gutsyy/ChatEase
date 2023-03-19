import { Button } from "@mantine/core";
import { IconCircleX } from "@tabler/icons-react";
import { setIsResponsing, setNotiGenerate } from "../../reducers/app";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useEffect } from "react";

export const RenderStopGenerationButton = () => {
  const dispatch = useAppDispatch();
  const isWaitingRes = useAppSelector((state) => state.app.isWaitingRes);
  const isResponsing = useAppSelector((state) => state.app.isResponsing);
  const notiStopGenerate = useAppSelector(
    (state) => state.app.notiStopGenerate
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
      <div className="sticky w-32 z-50 bottom-0 -translate-x-1/2 left-1/2 bg-transparent">
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
          停止回答
        </Button>
      </div>
    );
  }
  return null;
};
