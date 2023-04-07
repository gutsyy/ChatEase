import { useAppSelector } from "@/hooks/redux";
import { openAIPricing } from "@/services/openAI/data";
import { useMantineTheme, Text } from "@mantine/core";
import { IconCoin } from "@tabler/icons-react";
import clsx from "clsx";

const CountUsage = () => {
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

export default CountUsage;
