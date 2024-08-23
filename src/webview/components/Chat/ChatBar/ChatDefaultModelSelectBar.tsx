import { useAppDispatch } from "@/webview/hooks/redux";
import { SegmentedControl } from "@mantine/core";
import { setSelectedChat } from "@/webview/reducers/chatSlice";
import { useEffect } from "react";
import { OpenAIModels } from "@/webview/services/openAI/data";

interface IData {
  label: OpenAIModels,
  value: string
}

export function ChatDefaultModelSelectBox() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setSelectedChat({ model: "gpt-4o-mini-2024-07-18", name: "" }));
  }, []);

  const onValueChange = (value: OpenAIModels) => {
    dispatch(setSelectedChat({ model: value, name: "" }));
  };

  return (
    <SegmentedControl
      defaultValue="gpt-3.5-turbo-0613"
      data={[
        { label: 'gpt-4o-mini-2024-07-18', value: 'gpt-4o-mini' },
        { label: 'claude-3-5-sonnet-20240620', value: "claude-35-sonnet" },
      ] as IData[]}
      onChange={onValueChange}
    ></SegmentedControl>
  );
}
