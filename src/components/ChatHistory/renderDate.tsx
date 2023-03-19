export const renderDate = {
  date: "",
  render: (d: string) => {
    if (d !== renderDate.date) {
      renderDate.date = d;
      return (
        <div className="w-full flex justify-start ml-2 italic text-gray-400 text-xs mt-2 mb-1">
          {d}
        </div>
      );
    }
  },
};
