import { ActionIcon, Textarea, Loader, ScrollArea } from "@mantine/core";
import { IconBrandOpenai, IconBrandTelegram } from "@tabler/icons-react";
import { Markdown } from "../../pureComponents";
import { useAppSelector } from "../../hooks/redux";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  ChatGPTMessageType,
  requestPromptApi,
} from "../../services/openAI/apiConfig";

let isComposing = false;

const calGPTMessages = (
  prompt: string,
  inputContent: string
): ChatGPTMessageType[] => {
  return [
    {
      role: "system",
      content: prompt,
    },
    {
      role: "user",
      content: inputContent,
    },
  ];
};

export const PromptPanel = () => {
  const selectedPromptId = useAppSelector(
    (state) => state.prompt.selectedPromptId
  );
  const refreshPanel = useAppSelector((state) => state.prompt.refreshPanel);
  const answerContent = useAppSelector((state) => state.prompt.answerContent);
  const isPromptResponsing = useAppSelector(
    (state) => state.prompt.isPromptResponsing
  );
  const [inputContent, setInputContent] = useState<string>("");
  const textAreaInputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setInputContent("");
    if (textAreaInputRef) {
      textAreaInputRef.current?.focus();
    }
  }, [selectedPromptId]);

  const selectedPrompt =
    selectedPromptId === -1
      ? null
      : window.electronAPI.databaseIpcRenderer.getPromptById(selectedPromptId);

  const onSend = (event: FormEvent) => {
    event.preventDefault();
    const messages = calGPTMessages(selectedPrompt.prompt, inputContent);
    requestPromptApi(messages);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    if (!isComposing && e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.stopPropagation();
      target.form.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  return (
    <>
      <ScrollArea type="scroll" scrollbarSize={6} className="flex-1 h-full">
        {selectedPrompt && (
          <div className="flex flex-1 flex-col p-2 px-4">
            <div className="w-full text-center font-semibold text-lg">
              {selectedPrompt.name}
            </div>
            <div className="w-full text-center text-xs text-gray-500">
              {selectedPrompt.declare}
            </div>
            <form onSubmit={onSend}>
              <Textarea
                ref={textAreaInputRef}
                autoFocus
                autosize
                radius="md"
                value={inputContent}
                size="sm"
                className="mt-2"
                variant="filled"
                onKeyDown={handleKeyDown}
                onCompositionStart={() => {
                  isComposing = true;
                }}
                onCompositionEnd={() => {
                  isComposing = false;
                }}
                minRows={6}
                maxRows={20}
                onChange={(event) => setInputContent(event.currentTarget.value)}
              ></Textarea>
              <div className="w-full flex mt-1 justify-end">
                <div className="flex items-center justify-end">
                  <div className="text-sm text-gray-500 mr-2">
                    {`${window.electronAPI.othersIpcRenderer.calMessagesTokens(
                      calGPTMessages(selectedPrompt.prompt, inputContent)
                    )} tokens`}
                  </div>
                  <ActionIcon type="submit">
                    <IconBrandTelegram className="text-blue-500" size={18} />
                  </ActionIcon>
                </div>
              </div>
            </form>
            <div className="mr-1 p-2">
              <div className="text-sm">
                <Markdown
                  text={answerContent}
                  codeScope={(
                    window.electronAPI.storeIpcRenderer.get(
                      "markdown_code_scope"
                    ) as string
                  )
                    .split(",")
                    .map((language) => language.trim())}
                />
              </div>
              {isPromptResponsing ? <Loader variant="dots" size="sm" /> : null}
            </div>
          </div>
        )}
      </ScrollArea>
    </>
  );
};
