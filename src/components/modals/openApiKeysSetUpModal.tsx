import { Button, TextInput, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals, openModal } from "@mantine/modals";
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
        Second, Set your openAI API Host
      </div>
    ),
    closeOnClickOutside: false,
    withCloseButton: false,
    children: (
      <Form
        defaultValue={
          window.electronAPI.storeIpcRenderer.get("openai_api_origin") as string
        }
        buttonName="Start Journey"
        onConfirm={(value) => {
          window.electronAPI.storeIpcRenderer.set(
            "openai_api_origin",
            value.value.trim()
          );
          closeAllModals();
        }}
        explanation="For some reasons, you can customize the API Host of the application or use the default value directly."
      />
    ),
  });
};

export const openApiKeysSetupModal = () =>
  openModal({
    size: 600,
    title: (
      <div className="font-greycliff font-bold text-gray-800">
        First, Set your openAI API key
      </div>
    ),
    closeOnClickOutside: false,
    withCloseButton: false,
    children: (
      <Form
        buttonName="Next"
        onConfirm={(value) => {
          window.electronAPI.storeIpcRenderer.set(
            "open_api_key",
            value.value.trim()
          );
          openSetHostModal();
        }}
        explanation="Before using the application, please set the OpenAI API Key first. This
        application stores the key locally and will not upload it."
      />
    ),
  });
