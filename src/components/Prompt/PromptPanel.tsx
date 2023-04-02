import { ActionIcon, Textarea, Loader, Button } from "@mantine/core";
import { IconBrandTelegram } from "@tabler/icons-react";
import { Markdown } from "../../pureComponents";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { FormEvent, useEffect, useRef, useState } from "react";
import {
  calPromptActionMessages,
  requestPromptApi,
} from "../../services/openAI/apiConfig";
import { setPromptIsResponsing } from "../../reducers/promptSlice";
import type { Prompt } from "../../database/models/Prompt";

let isComposing = false;

export const PromptPanel = () => {
  const dispatch = useAppDispatch();
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
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt>(null);

  useEffect(() => {
    setInputContent("");
    if (textAreaInputRef) {
      textAreaInputRef.current?.focus();
    }
  }, [selectedPromptId]);

  useEffect(() => {
    if (selectedPromptId === -1) {
      setSelectedPrompt(null);
    } else {
      window.electronAPI.databaseIpcRenderer
        .getPromptById(selectedPromptId)
        .then((prompt) => {
          setSelectedPrompt(prompt);
        });
    }
  }, [selectedPromptId]);

  const onSend = (event: FormEvent) => {
    event.preventDefault();
    requestPromptApi(selectedPrompt, inputContent);
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
      {selectedPrompt && (
        <div className="flex flex-1 flex-col p-2 px-4 overflow-y-scroll chat-messages-view overflow-x-hidden relative h-full">
          <div className="w-full text-center font-bold font-greycliff text-lg">
            {selectedPrompt.name}
          </div>
          <div className="w-full text-center text-xs text-gray-500">
            {selectedPrompt.description}
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
                <div className="text-sm text-gray-500 mr-2 font-greycliff tracking-wide">
                  {`${window.electronAPI.othersIpcRenderer.calMessagesTokens(
                    calPromptActionMessages(selectedPrompt.prompt, inputContent)
                  )} tokens`}
                </div>
                <ActionIcon type="submit">
                  <IconBrandTelegram className="text-violet-500" size={18} />
                </ActionIcon>
              </div>
            </div>
          </form>
          <div className="p-2 flex-1">
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
            {isPromptResponsing ? (
              <Loader variant="dots" color="violet" size="sm" />
            ) : null}
          </div>
          {isPromptResponsing && (
            <div
              className="sticky bottom-0 z-10 bg-transparent flex justify-center"
              onClick={() => {
                dispatch(setPromptIsResponsing(false));
              }}
            >
              <Button radius="lg" size="xs" color="red">
                Stop Generation
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
