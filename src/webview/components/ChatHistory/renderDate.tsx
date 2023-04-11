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
            "w-full flex justify-start pl-3 italic pt-2 pb-1 font-bold",
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
