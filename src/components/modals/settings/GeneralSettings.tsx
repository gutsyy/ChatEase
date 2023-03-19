import { Switch } from "@mantine/core";
import { IconRotateClockwise } from "@tabler/icons-react";
import { useState } from "react";
import InputSetStyles from "./InputSetStyles";
import NumberInputSetStyles from "./NumberInputSetStyles";
import SettingItem, { SettingItemProps } from "./SettingItem";
import TooltipSetStyles from "./TooltipSetStyles";

const settings: SettingItemProps[] = [
  {
    label: "openai_api_key",
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
    label: "max_prompt_messages_num",
    questionInfo: "Prompt中可存在的最消息条数，若为0则根据max_tokens自动计算",
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
    label: "openai_api_url",
    questionInfo: "设置api请求地址，可用于设置反向代理",
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
            <TooltipSetStyles label="重置">
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
        如何设置反向代理？
        <a href="https://github.com/noobnooc/noobnooc/discussions/9">
          https://github.com/noobnooc/noobnooc/discussions/9
        </a>
      </>
    ),
  },
  {
    label: "max_tokens",
    questionInfo:
      "Prompt最大tokens数，当prompts中的tokens等于max_tokens，ChatGPT回答最大tokens数为（4096 - max_tokens）",
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
    label: "stream_mode",
    questionInfo: "是否开启回答stream模式，默认开启",
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
