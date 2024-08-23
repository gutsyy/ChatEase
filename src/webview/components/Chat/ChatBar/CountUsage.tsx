import { useAppSelector } from "@/webview/hooks/redux";
import { openAIPricing } from "@/webview/services/openAI/data";
import { useMantineTheme, Text, clsx } from "@mantine/core";
import { IconCoin } from "@tabler/icons-react";

const CountUsage = () => {
  const selectedChat = useAppSelector((state) => state.chat.selectedChat);
  const { colorScheme } = useMantineTheme();

  // TODO: 金额计算模型需要重新调整
  return null;

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

export default CountUsage;
