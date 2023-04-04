import { useContext, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  collapseAllMessages,
  recalMessages,
  setAllMessageInPromptsToFalse,
  setSelectedChat,
  setShareImageDialog,
  setTokensBoxWarningStateToFalse,
  updateSelectedChatPinnedSetting,
} from "../../reducers/chatSlice";
import {
  ActionIcon,
  clsx,
  Menu,
  NumberInput,
  Select,
  Slider,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { useClickOutside, useDisclosure } from "@mantine/hooks";
import { storeRendererUtils } from "../../store/storeRendererUtils";
import { openAIModels, openAIPricing } from "../../services/openAI/data";
import {
  IconArrowBarDown,
  IconArrowBarUp,
  IconCalculator,
  IconCircleLetterT,
  IconCloudOff,
  IconCoin,
  IconHistory,
  IconMenu2,
  IconPin,
  IconPinned,
  IconPinnedOff,
  IconShare3,
  IconX,
} from "@tabler/icons-react";
import { ChatContext } from ".";
import { useTranslation } from "react-i18next";

interface ChatStatisticsProps {
  messagesInPromptsNum: number;
}

export const ChatStatistics = ({
  messagesInPromptsNum,
}: ChatStatisticsProps) => {
  const dispatch = useAppDispatch();
  const warningState = useAppSelector(
    (state) => state.chat.tokensBoxWarningState
  );
  const chatId = useAppSelector((state) => state.chat.selectedChatId);
  const selectedChat = useAppSelector((state) => state.chat.selectedChat);
  const [opened, { close, open }] = useDisclosure();
  const ref = useClickOutside(() => {
    if (selectedChat && !selectedChat.pinnedSetting) {
      close();
    }
  });
  const { scrollToBottom } = useContext(ChatContext);
  const { colorScheme } = useMantineTheme();

  useEffect(() => {
    if (selectedChat && selectedChat.pinnedSetting) {
      open();
    }
  }, [selectedChat]);

  useEffect(() => {
    if (warningState) {
      setTimeout(() => {
        dispatch(setTokensBoxWarningStateToFalse());
      }, 2500);
    }
  }, [warningState]);

  const openChatSetting = () => {
    if (!warningState && !opened) {
      open();
    }
  };

  return (
    <div
      className={clsx(
        "sticky bg-transparent flex gap-2 justify-center items-end bottom-2 z-50 transition-all h-14",
        chatId === -1 ? "max-h-0 overflow-hidden" : "overflow-visible"
      )}
    >
      <ChatMenu />
      <div
        ref={ref}
        className={clsx(
          "px-3 py-1 shadow flex items-center",
          warningState && "outline outline-2 outline-red-500",
          opened ? "rounded-lg" : "rounded-full hover:cursor-pointer",
          colorScheme === "dark"
            ? "bg-dark-900 text-dark-100"
            : "bg-white text-gray-900"
        )}
        style={{
          height: opened
            ? selectedChat && selectedChat.pinnedSetting
              ? selectedChat &&
                (selectedChat.pinnedSetting === "messagesLimit" ||
                  selectedChat.pinnedSetting === "temperature")
                ? "45px"
                : "74px"
              : "240px"
            : warningState
            ? "42.59px"
            : "26.59px",
          transition: "height 0.15s ease-in-out",
        }}
        onClick={openChatSetting}
      >
        {opened ? (
          <ChatSettings chatId={chatId} onClose={close} />
        ) : (
          <Statistics
            messagesInPromptNum={messagesInPromptsNum}
            warningState={warningState}
          />
        )}
      </div>
      <CountTokens />
    </div>
  );
};

interface StatisticsProps {
  warningState: "tokens_limit" | "messages_limit" | "";
  messagesInPromptNum: number;
}

const Statistics = ({ warningState, messagesInPromptNum }: StatisticsProps) => {
  const messageTokens = useAppSelector((state) => state.chat.inputBoxTokens);
  const promptTokens = useAppSelector((state) => state.chat.totalPromptTokens);
  const selectedChat = useAppSelector((state) => state.chat.selectedChat);

  const messages_limit =
    (selectedChat && selectedChat.messagesLimit) ??
    window.electronAPI.storeIpcRenderer.get("max_messages_num");
  const tokens_limit =
    (selectedChat && selectedChat.tokensLimit) ??
    window.electronAPI.storeIpcRenderer.get("max_tokens");

  return (
    <div className="flex gap-1">
      <div className="flex flex-col justify-center items-center">
        {warningState && (
          <div className="text-red-500 font-semibold text-xs flex justify-center items-center">
            Operation failed: Exceeding limit!
          </div>
        )}
        <div className="flex gap-2">
          <div className="flex items-center gap-1">
            <IconCircleLetterT size={13} />
            <Text
              size="xs"
              className={
                warningState === "tokens_limit" ? "text-red-500 font-bold" : ""
              }
            >
              {`${promptTokens + messageTokens} Tokens ${
                warningState && `Max: ${tokens_limit}`
              }`}
            </Text>
          </div>
          <div className="flex items-center gap-1">
            <IconHistory size={13} />
            <Text
              size="xs"
              className={clsx(
                warningState === "messages_limit" && "text-red-500 font-bold"
              )}
            >
              {`${messagesInPromptNum} Messages ${
                warningState && `Max: ${messages_limit}`
              }`}
            </Text>
          </div>
        </div>
      </div>
    </div>
  );
};

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
    <div style={{ width: "420px" }}>
      {isSettingVisible("settingHead") && (
        <div className="flex justify-between items-center">
          <div className="font-greycliff font-bold">
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
            <Text
              className={clsx(
                "text-xs font-medium",
                selectedChat && selectedChat.pinnedSetting && "text-center"
              )}
            >
              {t("chat_settings_maxMessages")}
            </Text>
            <Slider
              onChange={onMessagesLimitChange}
              value={messagesLimit}
              color="violet"
              className="mt-1"
              defaultValue={1}
              min={0}
              size="xs"
              max={10}
              step={1}
            ></Slider>
          </div>
          <div
            style={{
              transform:
                selectedChat && selectedChat.pinnedSetting
                  ? "translate(-2px)"
                  : "translateY(4px)",
            }}
          >
            <ChatSettingsPinButton
              pinned={isSettingPinned("messagesLimit")}
              setting="messagesLimit"
            />
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
            <Text
              className={clsx(
                "text-xs font-medium",
                selectedChat && selectedChat.pinnedSetting && "text-center"
              )}
            >
              {t("chat_settings_maxTokens")}
            </Text>
            <NumberInput
              className="mt-1"
              onChange={onTokensLimitChange}
              value={tokensLimit}
              variant="filled"
              size="xs"
            />
          </div>
          <div style={{ transform: "translateY(-7px)" }}>
            <ChatSettingsPinButton
              pinned={isSettingPinned("tokensLimit")}
              setting="tokensLimit"
            />
          </div>
        </div>
      )}

      {isSettingVisible("temperature") && (
        <div className="flex w-full items-end mt-2 first:mt-0">
          <div className="flex-1">
            <Text
              className={clsx(
                "text-xs font-medium",
                selectedChat && selectedChat.pinnedSetting && "text-center"
              )}
            >
              {t("chat_settings_temperature")}
            </Text>
            <Slider
              onChange={onTemperatureChange}
              value={temperature}
              color="violet"
              className="mt-1"
              defaultValue={1}
              min={0}
              size="xs"
              max={2}
              label={(value) => value.toFixed(1)}
              step={0.1}
            ></Slider>
          </div>
          <div
            style={{
              transform:
                selectedChat && selectedChat.pinnedSetting
                  ? "translate(-2px)"
                  : "translateY(4px)",
            }}
          >
            <ChatSettingsPinButton
              pinned={isSettingPinned("temperature")}
              setting="temperature"
            />
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
            <Text
              className={clsx(
                "text-xs font-medium",
                selectedChat && selectedChat.pinnedSetting && "text-center"
              )}
            >
              {t("chat_settings_model")}
            </Text>
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
          <div style={{ transform: "translateY(-7px)" }}>
            <ChatSettingsPinButton
              pinned={isSettingPinned("model")}
              setting="model"
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ChatMenu = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { colorScheme } = useMantineTheme();

  return (
    <Menu shadow="md" position="top-start" radius="md">
      <Menu.Target>
        <ActionIcon
          variant="filled"
          size="md"
          radius="lg"
          color={colorScheme === "dark" ? "dark" : ""}
        >
          <IconMenu2
            size={16}
            className={clsx(
              colorScheme === "dark" ? "text-dark-100" : "text-white"
            )}
          />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown
        className={clsx(colorScheme === "dark" && "bg-dark-900 border-0")}
      >
        <Menu.Item
          className="text-xs"
          icon={<IconShare3 size={12} />}
          onClick={() => dispatch(setShareImageDialog(true))}
        >
          {t("chat_menu_share")}
        </Menu.Item>
        <Menu.Item
          className="text-xs"
          icon={<IconArrowBarDown size={12} />}
          onClick={() => dispatch(collapseAllMessages(false))}
        >
          {t("chat_menu_expandAll")}
        </Menu.Item>
        <Menu.Item
          className="text-xs"
          icon={<IconArrowBarUp size={12} />}
          onClick={() => dispatch(collapseAllMessages(true))}
        >
          {t("chat_menu_collapseAll")}
        </Menu.Item>
        <Menu.Item
          className="text-xs"
          icon={<IconCloudOff size={12} />}
          onClick={() => dispatch(setAllMessageInPromptsToFalse())}
        >
          {t("chat_menu_removeAll")}
        </Menu.Item>
        <Menu.Item
          className="text-xs"
          icon={<IconCalculator size={12} />}
          onClick={() => dispatch(recalMessages())}
        >
          {t("chat_menu_recalulator")}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

const CountTokens = () => {
  const selectedChat = useAppSelector((state) => state.chat.selectedChat);
  const { colorScheme } = useMantineTheme();

  return (
    <div
      className={clsx(
        "flex gap-1 rounded-full px-3 py-1 items-center shadow",
        colorScheme === "dark" ? "bg-dark-900" : "bg-white"
      )}
    >
      <IconCoin size={12} />
      <Text size="xs">
        {selectedChat &&
          (
            (selectedChat.costTokens / 1000) *
            openAIPricing[selectedChat.model]
          ).toFixed(4)}
      </Text>
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
      color="violet"
      onClick={() =>
        dispatch(updateSelectedChatPinnedSetting(pinned ? "" : setting))
      }
      size="xs"
      radius="lg"
      variant="filled"
    >
      {pinned ? <IconPinnedOff size={14} /> : <IconPin size={14} />}
    </ActionIcon>
  );
};
