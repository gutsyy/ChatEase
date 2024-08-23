import { useAppDispatch } from "@/webview/hooks/redux";
import { SegmentedControl } from "@mantine/core";
import { setSelectedChat } from "@/webview/reducers/chatSlice";
import { useEffect } from "react";
import { OpenAIModels } from "@/webview/services/openAI/data";

interface IData {
  label: string,
  value: OpenAIModels
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
      radius={999}
      defaultValue="gpt-4o-mini-2024-07-18"
      data={[
        { label: 'GPT-4o-mini', value: 'gpt-4o-mini-2024-07-18' },
        { label: 'Claude-35-sonnet', value: 'claude-3-5-sonnet-20240620' },
      ] as IData[]}
      onChange={onValueChange}
    ></SegmentedControl>
  );
}
