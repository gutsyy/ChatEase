import { Switch } from "@mantine/core";
import { IconRotateClockwise } from "@tabler/icons-react";
import { useState } from "react";
import InputSetStyles from "./InputSetStyles";
import NumberInputSetStyles from "./NumberInputSetStyles";
import SettingItem, { SettingItemProps } from "./SettingItem";
import TextareaSetStyles from "./TextareaSetStyles";
import TooltipSetStyles from "./TooltipSetStyles";

const settings: SettingItemProps[] = [
  {
    label: "OpenAI API Keys",
    questionInfo: "OpenAI API Keys",
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
    label: "Maximum number of conversations in prompt",
    questionInfo:
      "If the value is 0, it will be automatically calculated based on the maximum limit of tokens.",
    input: () => (
      <NumberInputSetStyles
        defaultValue={
          window.electronAPI.storeIpcRenderer.get("max_messages_num") as number
        }
        width="60px"
        onChange={(value) =>
          window.electronAPI.storeIpcRenderer.set("max_messages_num", value)
        }
      />
    ),
  },
  {
    label: "OpenAI API Host",
    questionInfo: "Can be used for reverse proxy.",
    input: () => {
      const [origin, setOrigin] = useState(
        window.electronAPI.storeIpcRenderer.get("openai_api_origin") as string
      );
      return (
        <InputSetStyles
          value={origin}
          width="300px"
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
          How to set up reverse proxy?
        </a>
      </>
    ),
  },
  {
    label: "Maximum limit of tokens",
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
    label: "ChatGPT stream response mode",
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
    label: "Scope of languages in Markdown",
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
          Supported Languages
        </a>
      </>
    ),
  },
];

const GeneralSettings = () => {
  return (
    <div className="flex flex-col w-full">
      {settings.map((setting, i) => (
        <SettingItem key={i} {...setting} />
      ))}
    </div>
  );
};

export default GeneralSettings;
