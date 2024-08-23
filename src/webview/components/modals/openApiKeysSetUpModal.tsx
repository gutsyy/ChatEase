import { SettingsKey } from "@/settings/settingsModel";
import { useAppDispatch } from "@/webview/hooks/redux";
import { setApiKey } from "@/webview/reducers/settingSlice";
import { Button, TextInput, Text } from "@mantine/core";
import { openModal } from "@mantine/modals";
import { t } from "i18next";
import { useRef, useState } from "react";

interface FormProps {
  explanation: string;
  buttonName: string;
  setupKey: SettingsKey;
  submitted?: () => void;
}
const Form = ({
  explanation,
  buttonName,
  submitted = () => null,
}: FormProps) => {
  const dispatch = useAppDispatch();
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>();

  return (
    <>
      <Text size="sm" color="gray" className="font-greycliff">
        {explanation}
      </Text>
      <form
        className="mt-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (ref.current.value) {
            dispatch(setApiKey(ref.current.value.trim()));
            submitted();
          } else {
            setError("");
          }
        }}
      >
        <TextInput
          ref={ref}
          error={error}
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
  openModal({
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
        setupKey="openai_api_origin"
        buttonName={t("setup_modal_setHost_button")}
        explanation={t("setup_modal_setHost_help")}
      />
    ),
  });
};

export const openApiKeysSetupModal = () =>
  openModal({
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
        buttonName={t("setup_modal_setKey_button")}
        setupKey="open_api_key"
        explanation={t("setup_modal_setKey_help")}
        submitted={() => openSetHostModal()}
      />
    ),
  });
