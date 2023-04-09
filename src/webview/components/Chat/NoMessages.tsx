import { IconBrandOpenai } from "@tabler/icons-react";

export const NoMessages = () => {
  return (
    <div
      className="w-full flex justify-center items-center absolute z-50"
      style={{ height: "calc(100% - 37px)" }}
    >
      <div className="flex flex-col items-center">
        <IconBrandOpenai
          size={48}
          strokeWidth={1}
          className=" bg-violet-500 p-1 text-white rounded-xl shadow animate-bounce"
        />
        <div className="mt-2 text-gray-500 font-greycliff font-bold">
          Making things easy with OpenAI ChatGPT
        </div>
      </div>
    </div>
  );
};
