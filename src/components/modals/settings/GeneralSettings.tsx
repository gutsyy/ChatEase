import { Select, Switch } from "@mantine/core";
import { IconRotateClockwise } from "@tabler/icons-react";
import { changeLanguage } from "i18next";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { lans } from "../../../i18n/i18n";
import InputSetStyles from "./InputSetStyles";
import NumberInputSetStyles from "./NumberInputSetStyles";
import SettingItem, { SettingItemProps } from "./SettingItem";
import TextareaSetStyles from "./TextareaSetStyles";
import TooltipSetStyles from "./TooltipSetStyles";

const GeneralSettings = () => {
  const { t } = useTranslation();

  const settings: SettingItemProps[] = [
    {
      label: t("settings_general_language"),
      input: () => (
        <Select
          styles={{
            input: {
              minHeight: "1.5rem",
              height: "1.5rem",
              paddingLeft: "6px",
              paddingRight: "6px",
              letterSpacing: "0.3px",
              lineHeight: "calc(1.5rem - 0.125rem)",
              width: "80px",
            },
          }}
          defaultValue={
            window.electronAPI.storeIpcRenderer.get("language") as string
          }
          size="xs"
          variant="filled"
          data={lans.map((lan) => ({ label: lan, value: lan }))}
          onChange={(value) => {
            window.electronAPI.storeIpcRenderer.set("language", value);
            changeLanguage(value);
          }}
        ></Select>
      ),
    },
    {
      label: t("settings_general_apiKey"),
      input: () => (
        <InputSetStyles
          defaultValue={
            window.electronAPI.storeIpcRenderer.get("open_api_key") as string
          }
          width="400px"
          onChange={(event) =>
            window.electronAPI.storeIpcRenderer.set(
              "open_api_key",
              event.currentTarget.value
            )
          }
        />
      ),
    },

    {
      label: t("settings_general_host"),
      questionInfo: t("settings_general_host_tooltip"),
      input: () => {
        const [origin, setOrigin] = useState(
          window.electronAPI.storeIpcRenderer.get("openai_api_origin") as string
        );
        return (
          <InputSetStyles
            value={origin}
            width="360px"
            onChange={(event) => {
              window.electronAPI.storeIpcRenderer.set(
                "openai_api_origin",
                event.currentTarget.value
              );
              setOrigin(event.currentTarget.value);
            }}
            rightSection={
              <TooltipSetStyles label="reset">
                <IconRotateClockwise
                  className="hover:cursor-pointer text-gray-400"
                  size={14}
                  onClick={() => {
                    window.electronAPI.storeIpcRenderer.reset(
                      "openai_api_origin"
                    );
                    setOrigin(
                      window.electronAPI.storeIpcRenderer.get(
                        "openai_api_origin"
                      ) as string
                    );
                  }}
                />
              </TooltipSetStyles>
            }
          />
        );
      },
      moreinfo: (
        <>
          <a
            className="ml-1"
            href="https://github.com/noobnooc/noobnooc/discussions/9"
          >
            {t("settings_general_host_help")}
          </a>
        </>
      ),
    },
    {
      label: t("settings_general_temperature"),
      input: () => (
        <NumberInputSetStyles
          min={0}
          max={2}
          defaultValue={
            window.electronAPI.storeIpcRenderer.get("temperature") as number
          }
          step={0.1}
          precision={1}
          width={60}
          onChange={(value) =>
            window.electronAPI.storeIpcRenderer.set("temperature", value)
          }
        ></NumberInputSetStyles>
      ),
    },
    {
      label: t("settings_general_maxMessages"),
      questionInfo: t("settings_general_maxMessages_tooltip"),
      input: () => (
        <NumberInputSetStyles
          defaultValue={
            window.electronAPI.storeIpcRenderer.get(
              "max_messages_num"
            ) as number
          }
          width="60px"
          onChange={(value) =>
            window.electronAPI.storeIpcRenderer.set("max_messages_num", value)
          }
        />
      ),
    },
    {
      label: t("settings_general_maxTokens"),
      input: () => (
        <NumberInputSetStyles
          max={4000}
          width="65px"
          defaultValue={
            window.electronAPI.storeIpcRenderer.get("max_tokens") as number
          }
          onChange={(value) =>
            window.electronAPI.storeIpcRenderer.set("max_tokens", value)
          }
        />
      ),
    },
    {
      label: t("settings_general_stream"),
      input: () => (
        <Switch
          onLabel="ON"
          color="green"
          offLabel="OFF"
          size="sm"
          defaultChecked={
            window.electronAPI.storeIpcRenderer.get("stream_enable") as boolean
          }
          onChange={(event) =>
            window.electronAPI.storeIpcRenderer.set(
              "stream_enable",
              event.currentTarget.checked
            )
          }
        ></Switch>
      ),
    },
    {
      label: t("settings_general_markdownScope"),
      input: () => (
        <TextareaSetStyles
          w={350}
          minRows={3}
          maxRows={3}
          defaultValue={
            window.electronAPI.storeIpcRenderer.get(
              "markdown_code_scope"
            ) as string
          }
          onChange={(event) =>
            window.electronAPI.storeIpcRenderer.set(
              "markdown_code_scope",
              event.currentTarget.value
            )
          }
        ></TextareaSetStyles>
      ),
      moreinfo: (
        <>
          <a href="https://github.com/highlightjs/highlight.js/blob/main/SUPPORTED_LANGUAGES.md">
            {t("settings_general_markdownScope_help")}
          </a>
        </>
      ),
    },
  ];

  return (
    <div className="flex flex-col w-full">
      {settings.map((setting, i) => (
        <SettingItem key={i} {...setting} />
      ))}
    </div>
  );
};

export default GeneralSettings;
