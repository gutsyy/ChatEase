import { useMantineTheme, TextInput, Button, Textarea } from "@mantine/core";
import { closeAllModals, modals } from "@mantine/modals";
import { FormEvent } from "react";
import { createPrompt, getAllPrompts } from "../../../reducers/promptSlice";
import { useAppDispatch } from "../../../hooks/redux";
import { useForm } from "@mantine/form";
import { Prompt } from "../../../database/models/Prompt";

const PromptForm = (initialValues: Prompt) => {
  const theme = useMantineTheme();

  // const initialValues: Prompt = {
  //   name: "",
  //   prompt: "",
  //   declare: "",
  // };

  const form = useForm({
    initialValues,
  });

  const dispatch = useAppDispatch();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    // Update
    if (initialValues.id) {
      window.electronAPI.databaseIpcRenderer.updatePrompt(
        initialValues.id,
        form.values
      );
      dispatch(getAllPrompts());
      closeAllModals();
      return;
    }

    const id = window.electronAPI.databaseIpcRenderer.createPrompt(form.values);
    dispatch(createPrompt(id));

    closeAllModals();
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        size="xs"
        label="Action Name"
        variant="filled"
        required
        placeholder="请输入操作名称"
        {...form.getInputProps("name")}
      />
      <TextInput
        size="xs"
        className="mt-2"
        label="Action Description"
        variant="filled"
        required
        {...form.getInputProps("declare")}
      />
      <Textarea
        size="xs"
        variant="filled"
        className="mt-2"
        label="Action Prompt"
        minRows={4}
        maxRows={8}
        required
        placeholder="请输入操作Prompt语句"
        {...form.getInputProps("prompt")}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: theme.spacing.sm,
        }}
      >
        <Button size="xs" type="submit">
          {initialValues.id ? "Update" : "Create"}
        </Button>
      </div>
    </form>
  );
};

export const openPromptFormModal = (initialValues?: Prompt) => {
  if (!initialValues) {
    initialValues = {
      name: "",
      prompt: "",
      declare: "",
    };
  }
  modals.open({
    title: initialValues ? "Edit Action" : "Create Action",
    styles: {
      header: {
        padding: "0.5rem",
        paddingBottom: "0.5rem",
        paddingLeft: "0.75rem",
      },
      body: {
        padding: "0.75rem",
      },
    },
    centered: true,
    closeOnClickOutside: false,
    children: <PromptForm {...initialValues} />,
    size: 600,
  });
};
