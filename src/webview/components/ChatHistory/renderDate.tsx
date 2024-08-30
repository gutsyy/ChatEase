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
            "w-full flex justify-start pl-2 italic pt-1 pb-2 font-bold",
            colorScheme === "dark" ? "text-white" : "text-gray-300"
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
