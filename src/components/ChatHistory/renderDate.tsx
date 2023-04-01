import clsx from "clsx";

export const renderDate = {
  date: "",
  render: (d: string) => {
    if (d !== renderDate.date) {
      renderDate.date = d;
      return (
        <div
          className={clsx(
            "w-full flex justify-start ml-2 italic text-dark-200 text-xs mt-2 mb-1"
          )}
        >
          {d}
        </div>
      );
    }
  },
};
