import { useAppDispatch, useAppSelector } from "@/webview/hooks/redux";
import {
  setSelectedChat,
  recalMessages,
  updateSelectedChatPinnedSetting,
} from "@/webview/reducers/chatSlice";
import { openAIModels } from "@/webview/services/openAI/data";
import { storeRendererUtils } from "@/store/storeRendererUtils";
import {
  ActionIcon,
  Slider,
  NumberInput,
  Select,
  Text,
  clsx,
} from "@mantine/core";
import { IconPin, IconPinnedOff, IconX } from "@tabler/icons-react";
import { useState, useEffect, memo } from "react";
import { useTranslation } from "react-i18next";

interface ChatSettingsProps {
  chatId: number;
  onClose: () => void;
}

type ChatSettingsType =
  | "settingHead"
  | "messagesLimit"
  | "tokensLimit"
  | "model"
  | "temperature";

const ChatSettings = ({ chatId, onClose }: ChatSettingsProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const selectedChat = useAppSelector((state) => state.chat.selectedChat);
  const [messagesLimit, setMessagesLimit] = useState<number>(0);
  const [tokensLimit, setTokensLimit] = useState<number>(0);
  const [temperature, setTemperature] = useState<number>(0);
  const [model, setModel] = useState<string>("");
  const [mounted, setMounted] = useState<boolean>(false);
  const totalPromptTokens = useAppSelector(
    (state) => state.chat.totalPromptTokens
  );
  const inputBoxTokens = useAppSelector((state) => state.chat.inputBoxTokens);

  const isSettingVisible = (settingName: ChatSettingsType) => {
    if (selectedChat) {
      if (settingName === "settingHead") {
        return !selectedChat.pinnedSetting;
      }
      if (!selectedChat.pinnedSetting) {
        return true;
      }
      return selectedChat.pinnedSetting === settingName;
    }
    return true;
  };

  const isSettingPinned = (settingName: ChatSettingsType) => {
    if (selectedChat) {
      return selectedChat.pinnedSetting === settingName;
    }
    return false;
  };

  useEffect(() => {
    window.electronAPI.databaseIpcRenderer.getChatById(chatId).then((chat) => {
      setMessagesLimit(
        chat.messagesLimit ?? storeRendererUtils.get<number>("max_messages_num")
      );
      setTokensLimit(
        chat.tokensLimit ?? storeRendererUtils.get<number>("max_tokens")
      );
      setTemperature(chat.temperature ?? 1);
      setModel(chat.model ?? "gpt-3.5-turbo");
    });
  }, []);

  useEffect(() => {
    if (mounted) {
      onClose();
    } else {
      setMounted(true);
    }
  }, [chatId]);

  const onMessagesLimitChange = (value: number) => {
    setMessagesLimit(value);
    window.electronAPI.databaseIpcRenderer
      .updateChatFieldById(chatId, "messagesLimit", value)
      .then((chat) => {
        dispatch(setSelectedChat(chat));
        dispatch(recalMessages());
      });
  };

  const onTokensLimitChange = (value: number) => {
    setTokensLimit(value);
    window.electronAPI.databaseIpcRenderer
      .updateChatFieldById(chatId, "tokensLimit", value)
      .then((chat) => {
        dispatch(setSelectedChat(chat));
        dispatch(recalMessages());
      });
  };

  const onTemperatureChange = (value: number) => {
    setTemperature(value);
    window.electronAPI.databaseIpcRenderer
      .updateChatFieldById(chatId, "temperature", value)
      .then((chat) => {
        dispatch(setSelectedChat(chat));
      });
  };

  const onModelChange = (value: string) => {
    setModel(value);
    window.electronAPI.databaseIpcRenderer
      .updateChatFieldById(chatId, "model", value)
      .then((chat) => {
        setSelectedChat(chat);
      });
  };

  return (
    <div style={{ width: "27rem" }}>
      {isSettingVisible("settingHead") && (
        <div className="flex justify-between items-center">
          <div className="font-greycliff font-bold text-sm">
            {t("chat_settings_title")}
          </div>
          <ActionIcon
            size="sm"
            onClick={() => {
              onClose();
            }}
          >
            <IconX size={14} />
          </ActionIcon>
        </div>
      )}
      {isSettingVisible("messagesLimit") && (
        <div className="flex items-end mt-2 only:mt-0">
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <Text
                className={clsx(
                  "text-xs font-medium",
                  selectedChat && selectedChat.pinnedSetting && "text-center"
                )}
              >
                {t("chat_settings_maxMessages")}
                <span className="ml-2">
                  {`[current tokens: ${totalPromptTokens + inputBoxTokens}]`}
                </span>
              </Text>
              <ChatSettingsPinButton
                pinned={isSettingPinned("messagesLimit")}
                setting="messagesLimit"
              />
            </div>
            <Slider
              labelAlwaysOn
              onChange={onMessagesLimitChange}
              value={messagesLimit}
              size="sm"
              color="violet.4"
              className="mt-1"
              defaultValue={1}
              min={0}
              max={10}
              step={1}
            ></Slider>
          </div>
        </div>
      )}

      {isSettingVisible("tokensLimit") && (
        <div
          className={clsx(
            "flex items-end mt-2 first:mt-0",
            selectedChat && selectedChat.pinnedSetting && "h-11"
          )}
        >
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <Text
                className={clsx(
                  "text-xs font-medium",
                  selectedChat && selectedChat.pinnedSetting && "text-center"
                )}
              >
                {t("chat_settings_maxTokens")}
                <span className="ml-2">
                  {`[current tokens: ${totalPromptTokens + inputBoxTokens}]`}
                </span>
              </Text>
              <ChatSettingsPinButton
                pinned={isSettingPinned("tokensLimit")}
                setting="tokensLimit"
              />
            </div>
            <NumberInput
              className="mt-1"
              onChange={onTokensLimitChange}
              value={tokensLimit}
              variant="filled"
              size="xs"
            />
          </div>
        </div>
      )}

      {isSettingVisible("temperature") && (
        <div className="flex w-full items-end mt-2 first:mt-0">
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <Text
                className={clsx(
                  "text-xs font-medium",
                  selectedChat && selectedChat.pinnedSetting && "text-center"
                )}
              >
                {t("chat_settings_temperature")}
              </Text>

              <ChatSettingsPinButton
                pinned={isSettingPinned("temperature")}
                setting="temperature"
              />
            </div>
            <Slider
              labelAlwaysOn
              onChange={onTemperatureChange}
              value={temperature}
              color="violet.4"
              className="mt-1"
              defaultValue={1}
              min={0}
              size="sm"
              max={2}
              label={(value) => value.toFixed(1)}
              step={0.1}
            ></Slider>
          </div>
        </div>
      )}

      {isSettingVisible("model") && (
        <div
          className={clsx(
            "flex items-end mt-2 first:mt-0",
            selectedChat && selectedChat.pinnedSetting && "h-11"
          )}
        >
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <Text
                className={clsx(
                  "text-xs font-medium",
                  selectedChat && selectedChat.pinnedSetting && "text-center"
                )}
              >
                {t("chat_settings_model")}
              </Text>
              <ChatSettingsPinButton
                pinned={isSettingPinned("model")}
                setting="model"
              />
            </div>
            <Select
              onChange={onModelChange}
              value={model}
              className="mt-1"
              size="xs"
              variant="filled"
              data={openAIModels.map((model) => ({
                label: model,
                value: model,
              }))}
            ></Select>
          </div>
        </div>
      )}
    </div>
  );
};

const ChatSettingsPinButton = ({
  pinned,
  setting,
}: {
  pinned: boolean;
  setting: ChatSettingsType;
}) => {
  const dispatch = useAppDispatch();

  return (
    <ActionIcon
      className="ml-3"
      color="violet.5"
      onClick={() =>
        dispatch(updateSelectedChatPinnedSetting(pinned ? "" : setting))
      }
      size="xs"
    >
      {pinned ? <IconPinnedOff size={14} /> : <IconPin size={12} />}
    </ActionIcon>
  );
};

export default memo(ChatSettings);
