import { useAppDispatch } from "@/webview/hooks/redux";
import { SegmentedControl } from "@mantine/core";
import { setSelectedChat } from "@/webview/reducers/chatSlice";
import { useEffect } from "react";
import { OpenAIModels } from "@/webview/services/openAI/data";

export function ChatDefaultModelSelectBox() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSelectedChat({ model: "gpt-3.5-turbo-0613", name: "" }));
  }, []);

  const onValueChange = (value: OpenAIModels) => {
    dispatch(setSelectedChat({ model: value, name: "" }));
  };

  return (
    <SegmentedControl
      defaultValue="gpt-3.5-turbo-0613"
      data={[
        { label: "GPT-4", value: "gpt-4-0613" },
        { label: "GPT-3", value: "gpt-3.5-turbo-0613" },
      ]}
      onChange={onValueChange}
    ></SegmentedControl>
  );
}
