import React, { useEffect, useRef } from "react";
import {} from "electron";

export const TitleBar: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { getPos, setPos } = window.electronAPI.windowIpcRenderer;

    const mousemove = (event: MouseEvent) => {
      setPos(getPos().x + event.movementX, getPos().y + event.movementY);
    };

    const mouseup = () => {
      ref.current.removeEventListener("mousemove", mousemove);
      document.removeEventListener("mouseup", mouseup);
    };

    const mousedown = () => {
      ref.current.addEventListener("mousemove", mousemove);
      document.addEventListener("mouseup", mouseup);
    };

    ref.current.addEventListener("mousedown", mousedown);

    return () => ref.current.removeEventListener("mousedown", mousedown);
  }, []);

  return (
    <div
      className="w-full"
      ref={ref}
      onDoubleClick={() => window.electronAPI.windowIpcRenderer.setWinFull()}
    >
      <div className="h-10 flex justify-center items-center text-sm font-semibold select-none pointer-events-none"></div>
    </div>
  );
};
