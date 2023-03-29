import { IconBrandOpenai } from "@tabler/icons-react";

export const NoMessages = () => {
  return (
    <div
      className="w-full flex justify-center items-center"
      style={{ height: "calc(100% - 37px)" }}
    >
      <div className="flex flex-col items-center">
        <IconBrandOpenai
          size={48}
          strokeWidth={1}
          className=" bg-green-600 p-1 text-white rounded-xl shadow"
        />
        <div className="mt-2 text-gray-500">
          Making things easy with OpenAI ChatGPT
        </div>
      </div>
    </div>
  );
};
