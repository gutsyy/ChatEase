import { clsx, useMantineTheme } from "@mantine/core";

export const renderDate = {
  date: "",
  render: ({ d }: { d: string }) => {
    if (d !== renderDate.date) {
      renderDate.date = d;
      const { colorScheme } = useMantineTheme();
      return (
        <div
          className={clsx(
            "w-full flex justify-start ml-2 italic mt-2 mb-1",
            colorScheme === "dark" ? "text-white" : "text-gray-500"
          )}
          style={{
            fontSize: "0.675rem",
          }}
        >
          {d}
        </div>
      );
    }
  },
};
