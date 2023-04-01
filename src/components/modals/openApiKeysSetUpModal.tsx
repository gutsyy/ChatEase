import { Button, TextInput, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals, openModal } from "@mantine/modals";
import { t } from "i18next";
import { useEffect } from "react";

interface FormProps {
  onConfirm: (values: any) => void;
  explanation: string;
  buttonName: string;
  defaultValue?: string;
}
const Form = ({
  onConfirm,
  explanation,
  buttonName,
  defaultValue = "",
}: FormProps) => {
  const form = useForm({
    initialValues: {
      value: defaultValue,
    },
    validate: {
      value: (value) => (value.trim() ? null : "Please enter your key"),
    },
  });

  useEffect(() => {
    form.setFieldValue("value", defaultValue);
  }, [defaultValue]);

  return (
    <>
      <Text size="sm" color="gray" className="font-greycliff">
        {explanation}
      </Text>
      <form
        className="mt-2"
        onSubmit={form.onSubmit((value) => {
          onConfirm(value);
        })}
      >
        <TextInput
          variant="filled"
          size="xs"
          {...form.getInputProps("value")}
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
        defaultValue={
          window.electronAPI.storeIpcRenderer.get("openai_api_origin") as string
        }
        buttonName={t("setup_modal_setHost_button")}
        onConfirm={(value) => {
          window.electronAPI.storeIpcRenderer.set(
            "openai_api_origin",
            value.value.trim()
          );
          closeAllModals();
        }}
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
        onConfirm={(value) => {
          window.electronAPI.storeIpcRenderer.set(
            "open_api_key",
            value.value.trim()
          );
          openSetHostModal();
        }}
        explanation={t("setup_modal_setKey_help")}
      />
    ),
  });
