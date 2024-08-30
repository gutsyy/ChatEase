import { SettingsKey } from "@/settings/settingsModel";
import { setApiKey, setOpenaiApiOrigin } from "@/webview/reducers/settingSlice";
import store from "@/webview/store";
import { Button, TextInput, Text } from "@mantine/core";
import { closeModal, openModal } from "@mantine/modals";
import { t } from "i18next";
import { useEffect, useRef } from "react";

interface FormProps {
  explanation: string;
  buttonName: string;
  setupKey: SettingsKey;
  submitted?: (value: string) => void;
}
const Form = ({
  explanation,
  buttonName,
  submitted = () => null,
}: FormProps) => {
  const ref = useRef<HTMLInputElement>();

  // clear value
  useEffect(() => {
    ref.current.value = '';
  }, [setApiKey])

  return (
    <>
      <Text size="sm" color="gray" className="font-greycliff">
        {explanation}
      </Text>
      <form
        className="mt-2"
        onSubmit={(e) => {
          e.preventDefault();
          submitted(ref.current.value);
        }}
      >
        <TextInput
          ref={ref}
          variant="filled"
          size="xs"
        ></TextInput>
        <div className="flex justify-end mt-4">
          <Button
            size="xs"
            variant="filled"
            type="submit"
            gradient={{ from: "teal", to: "blue", deg: 60 }}
          >
            {buttonName}
          </Button>
        </div>
      </form>
    </>
  );
};

const openSetHostModal = () => {
  const modalId = 'host-modal';

  const handleSubmit = (value: string) => {
    if (value) {
      store.dispatch(setOpenaiApiOrigin(value));
    }
    closeModal(modalId);
  }

  openModal({
    modalId,
    size: 600,
    title: (
      <div className="font-greycliff font-bold text-gray-800">
        {t("setup_modal_setHost_title")}
      </div>
    ),
    closeOnClickOutside: false,
    withCloseButton: false,
    children: (
      <Form
        key={modalId}
        setupKey="openai_api_origin"
        buttonName={t("setup_modal_setHost_button")}
        explanation={t("setup_modal_setHost_help")}
        submitted={handleSubmit}
      />
    ),
  });
};

export const openApiKeysSetupModal = () => {

  const modalId = 'set-open-api-modal';

  const handleSumit = (value: string) => {
    store.dispatch(setApiKey(value));
    closeModal(modalId)
    openSetHostModal();
  }

  openModal({
    modalId,
    size: 600,
    title: (
      <div className="font-greycliff font-bold text-gray-800">
        {t("setup_modal_setKey_title")}
      </div>
    ),
    closeOnClickOutside: false,
    withCloseButton: false,
    children: (
      <Form
        key={modalId}
        buttonName={t("setup_modal_setKey_button")}
        setupKey="open_api_key"
        explanation={t("setup_modal_setKey_help")}
        submitted={handleSumit}
      />
    ),
  })
};
