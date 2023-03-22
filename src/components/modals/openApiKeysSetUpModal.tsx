import { Button, TextInput, Text } from "@mantine/core";
import { useForm } from "@mantine/form";
import { closeAllModals, openModal } from "@mantine/modals";

const Form = () => {
  const form = useForm({
    initialValues: {
      key: "",
    },
    validate: {
      key: (value) => (value.trim() ? null : "Please enter your key"),
    },
  });

  return (
    <>
      <Text size="sm" color="gray">
        Before using the application, please set the OpenAI API Key first. This
        application stores the key locally and will not upload it.
      </Text>
      <form
        className="mt-2"
        onSubmit={form.onSubmit((value) => {
          window.electronAPI.storeIpcRenderer.set(
            "open_api_key",
            value.key.trim()
          );
          closeAllModals();
        })}
      >
        <TextInput
          variant="filled"
          size="xs"
          {...form.getInputProps("key")}
        ></TextInput>
        <div className="flex justify-end mt-4">
          <Button
            size="xs"
            variant="gradient"
            type="submit"
            gradient={{ from: "teal", to: "blue", deg: 60 }}
          >
            Start Journey
          </Button>
        </div>
      </form>
    </>
  );
};

export const openApiKeysSetupModal = () =>
  openModal({
    size: 600,
    title: "Set your Key",
    closeOnClickOutside: false,
    withCloseButton: false,
    children: <Form />,
  });
