import {
  useMantineTheme,
  TextInput,
  Button,
  Textarea,
  Slider,
} from "@mantine/core";
import { closeAllModals, modals } from "@mantine/modals";
import { FormEvent } from "react";
import { createPrompt, getAllPrompts } from "../../../reducers/promptSlice";
import { useAppDispatch } from "../../../hooks/redux";
import { useForm } from "@mantine/form";
import { Prompt } from "@/database/models/Prompt";
import { ModalTitle } from "../../../pureComponents/ModalTitle";
import { useTranslation } from "react-i18next";
import { t } from "i18next";
import { appSettings } from "@/webview/utils/settings";

const PromptForm = (initialValues: Prompt) => {
  const theme = useMantineTheme();
  const form = useForm({
    initialValues: { ...initialValues },
  });
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

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

    window.electronAPI.databaseIpcRenderer
      .createPrompt(form.values)
      .then((id) => {
        dispatch(createPrompt(id));
      });

    closeAllModals();
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextInput
        size="xs"
        label={t("sideExtend_prompt_form_name")}
        variant="filled"
        required
        {...form.getInputProps("name")}
      />
      <TextInput
        size="xs"
        className="mt-2"
        label={t("sideExtend_prompt_form_description")}
        variant="filled"
        required
        {...form.getInputProps("description")}
      />
      <div className="mt-2 text-xs font-medium">
        {t("sideExtend_prompt_form_temperature")}
      </div>
      <Slider
        className="mt-1"
        min={0}
        size="xs"
        max={2}
        color="violet"
        label={(value) => value.toFixed(1)}
        step={0.1}
        {...form.getInputProps("temperature")}
      ></Slider>
      <Textarea
        size="xs"
        variant="filled"
        className="mt-2"
        label={t("sideExtend_prompt_form_prompt")}
        minRows={12}
        maxRows={12}
        required
        {...form.getInputProps("prompt")}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginTop: theme.spacing.sm,
        }}
      >
        <Button size="xs" type="submit" color="violet">
          {initialValues.id
            ? t("sideExtend_prompt_form_save_button")
            : t("sideExtend_prompt_form_create_button")}
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
      description: "",
      temperature: appSettings.get("temperature") as number,
    };
  }

  modals.open({
    title: (
      <ModalTitle
        title={
          initialValues
            ? t("sideExtend_prompt_edit_title")
            : t("sideExtend_prompt_new_title")
        }
      />
    ),
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
