import { closeAllModals, modals, openConfirmModal } from "@mantine/modals";
import { Text } from "@mantine/core";
import type { OpenConfirmModal } from "@mantine/modals/lib/context";
import { ModalTitle } from "../../pureComponents/ModalTitle";
import { t } from "i18next";

export const openCustomConfirmModal = (props: OpenConfirmModal) => {
  modals.openConfirmModal({
    labels: { cancel: t("cancel"), confirm: t("confirm") },
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
    title: <ModalTitle title="Confirm deletion" />,
    children: (
      <Text size="sm" weight="normal">
        {t("sideExtend_chat_delete_prompt")}{" "}
        <div className="text-red-500 mt-1">{deleteName}</div>
      </Text>
    ),
    labels: { confirm: t("confirm"), cancel: t("cancel") },
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
