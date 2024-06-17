import { useAppDispatch } from "@/webview/hooks/redux";
import { SegmentedControl } from "@mantine/core";
import { setSelectedChat } from "@/webview/reducers/chatSlice";
import { useEffect } from "react";
import { OpenAIModels } from "@/webview/services/openAI/data";

export function ChatDefaultModelSelectBox() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSelectedChat({ model: "gpt-4o-2024-05-13", name: "" }));
  }, []);

  const onValueChange = (value: OpenAIModels) => {
    dispatch(setSelectedChat({ model: value, name: "" }));
  };

  return (
    <SegmentedControl
      defaultValue="gpt-4o-2024-05-13"
      data={[
        { label: "GPT-4o", value: "gpt-4o-2024-05-13" },
        { label: "GPT-3", value: "gpt-3.5-turbo-0613" },
      ]}
      onChange={onValueChange}
    ></SegmentedControl>
  );
}
