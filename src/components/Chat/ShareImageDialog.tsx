import { ActionIcon, Dialog, Image } from "@mantine/core";
import { IconCopy, IconX } from "@tabler/icons-react";
import { setShareImageDialog } from "../../reducers/chatSlice";
import { useAppDispatch } from "../../hooks/redux";

export const ShareImageDialog = ({
  canvas,
}: {
  canvas: HTMLCanvasElement | null;
}) => {
  const dispatch = useAppDispatch();

  const onCopy = () => {
    if (canvas) {
      canvas.toBlob((blob) => {
        navigator.clipboard.write([
          new ClipboardItem({
            [blob.type]: blob,
          }),
        ]);
      });
      dispatch(setShareImageDialog(false));
    }
  };

  const onClose = () => {
    dispatch(setShareImageDialog(false));
  };

  return (
    <Dialog
      opened={Boolean(canvas)}
      radius="md"
      styles={{ root: { maxHeight: "300px", overflow: "auto" } }}
    >
      <div className="relative">
        <Image src={canvas && canvas.toDataURL("image/png")}></Image>
        <div className="flex gap-4 items-center justify-center sticky bottom-1 h-0 overflow-visible w-full">
          <ActionIcon
            size="sm"
            color="violet"
            variant="filled"
            radius="lg"
            onClick={onCopy}
          >
            <IconCopy size={14} />
          </ActionIcon>
          <ActionIcon
            size="sm"
            color="gray"
            variant="filled"
            radius="lg"
            onClick={onClose}
          >
            <IconX size={14} />
          </ActionIcon>
        </div>
      </div>
    </Dialog>
  );
};
