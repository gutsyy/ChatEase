import { Switch } from "@mantine/core";
import { IconRotateClockwise } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import InputSetStyles from "./InputSetStyles";
import NumberInputSetStyles from "./NumberInputSetStyles";
import SettingItem, { SettingItemProps } from "./SettingItem";
import TextareaSetStyles from "./TextareaSetStyles";
import TooltipSetStyles from "./TooltipSetStyles";
import { useAppDispatch, useAppSelector } from "@/webview/hooks/redux";
import {
  setApiKey,
  setMarkdownCodeScope,
  setMaxMessagesNum,
  setMaxTokens,
  setOpenaiApiOrigin,
  setStreamEnable,
  setTemperature,
} from "@/webview/reducers/settingSlice";
import { appSettings } from "@/webview/utils/settings";

const GeneralSettings = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const settings: SettingItemProps[] = [
    {
      label: t("settings_general_apiKey"),
      input: () => {
        const apiKey = useAppSelector((state) => state.settings.open_api_key);
        return (
          <InputSetStyles
            defaultValue={apiKey}
            width="400px"
            onChange={(event) => dispatch(setApiKey(event.currentTarget.value))}
          />
        );
      },
    },

    {
      label: t("settings_general_host"),
      questionInfo: t("settings_general_host_tooltip"),
      input: () => {
        const openaiApiOrigin = useAppSelector(
          (state) => state.settings.openai_api_origin
        );
        return (
          <InputSetStyles
            value={openaiApiOrigin}
            width="360px"
            onChange={(event) => {
              dispatch(setOpenaiApiOrigin(event.currentTarget.value));
            }}
            rightSection={
              <TooltipSetStyles label="reset">
                <IconRotateClockwise
                  className="hover:cursor-pointer text-gray-400"
                  size={14}
                  onClick={() => {
                    dispatch(
                      setOpenaiApiOrigin(
                        appSettings.reset("openai_api_origin") as string
                      )
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
          <div className="flex">
            <a className="ml-1" href="https://aihubmix.com/">个人使用 AIHubMix 购买</a>
            <a
              className="ml-1"
              href="https://github.com/noobnooc/noobnooc/discussions/9"
            >
              {t("settings_general_host_help")}
            </a>
          </div>
        </>
      ),
    },
    {
      label: t("settings_general_temperature"),
      input: () => {
        const temperature = useAppSelector(
          (state) => state.settings.temperature
        );
        return (
          <NumberInputSetStyles
            min={0}
            max={2}
            defaultValue={temperature}
            step={0.1}
            width={60}
            precision={1}
            onChange={(value: number) => dispatch(setTemperature(value))}
          ></NumberInputSetStyles>
        );
      },
    },
    {
      label: t("settings_general_maxMessages"),
      questionInfo: t("settings_general_maxMessages_tooltip"),
      input: () => {
        const maxMessagesNum = useAppSelector(
          (state) => state.settings.max_messages_num
        );
        return (
          <NumberInputSetStyles
            defaultValue={maxMessagesNum}
            width="60px"
            onChange={(value: number) => dispatch(setMaxMessagesNum(value))}
          />
        );
      },
    },
    {
      label: t("settings_general_maxTokens"),
      input: () => {
        const tokensLimit = useAppSelector(
          (state) => state.settings.max_tokens
        );
        return (
          <NumberInputSetStyles
            max={4000}
            min={0}
            width="65px"
            defaultValue={tokensLimit}
            onChange={(value: number) => dispatch(setMaxTokens(value))}
          />
        );
      },
    },
    {
      label: t("settings_general_stream"),
      input: () => {
        const stream = useAppSelector((state) => state.settings.stream_enable);
        return (
          <Switch
            onLabel="ON"
            color="green"
            offLabel="OFF"
            size="sm"
            defaultChecked={stream}
            onChange={(event) =>
              dispatch(setStreamEnable(event.currentTarget.checked))
            }
          ></Switch>
        );
      },
    },
    {
      label: t("settings_general_markdownScope"),
      input: () => {
        const markdownCodeScope = useAppSelector(
          (state) => state.settings.markdown_code_scope
        );
        return (
          <TextareaSetStyles
            w={350}
            minRows={3}
            maxRows={3}
            defaultValue={markdownCodeScope}
            onChange={(event) =>
              dispatch(setMarkdownCodeScope(event.currentTarget.value))
            }
          ></TextareaSetStyles>
        );
      },
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
