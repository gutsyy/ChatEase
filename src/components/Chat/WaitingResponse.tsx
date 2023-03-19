import { Loader, Text } from "@mantine/core";
import { IconBrandOpenai } from "@tabler/icons-react";
import { useRef, useEffect } from "react";

const WaitingResponse = () => {
  const loadingMessageRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   if (loadingMessageRef.current) {
  //     loadingMessageRef.current.scrollIntoView({ behavior: "smooth" });
  //   }
  // }, []);

  return (
    <div className="px-4 py-2 pb-3 mt-2" ref={loadingMessageRef}>
      <div className="flex justify-start items-center mb-1 py-2">
        <IconBrandOpenai className="text-blue-500 mr-1" size={12} />
        <Text size="xs" weight={700}>
          ChatGPT
        </Text>
        <div className="text-gray-500 text-xs ml-2">
          {new Date().toLocaleTimeString()}
        </div>
      </div>
      <div>
        <Loader variant="dots" size={20} className="ml-5" />
      </div>
    </div>
  );
};

export default WaitingResponse;
