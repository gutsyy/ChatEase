import { closeAllModals, modals, openConfirmModal } from "@mantine/modals";
import { Text } from "@mantine/core";
import type { OpenConfirmModal } from "@mantine/modals/lib/context";

export const openCustomConfirmModal = (props: OpenConfirmModal) => {
  modals.openConfirmModal({
    labels: { cancel: "Cancel", confirm: "Confirm" },
    cancelProps: {
      color: "gray",
      size: "xs",
    },
    confirmProps: {
      size: "xs",
    },
    ...props,
  });
};

export const openDeleteConfirmModal = (
  props: OpenConfirmModal,
  deleteName: string
) => {
  openConfirmModal({
    title: "Confirm deletion",
    children: (
      <Text size="sm" weight="normal">
        Are you sure you want to delete?{" "}
        <div className="text-red-500 font-semibold mt-1">{deleteName}</div>
      </Text>
    ),
    labels: { confirm: "Confirm", cancel: "Cancel" },
    onCancel: () => closeAllModals(),
    cancelProps: {
      size: "xs",
      color: "gray",
    },
    confirmProps: {
      size: "xs",
      color: "red",
    },
    ...props,
  });
};
