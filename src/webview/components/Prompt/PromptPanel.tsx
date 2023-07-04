import {
  ActionIcon,
  Textarea,
  Loader,
  Button,
  useMantineTheme,
  clsx,
  Text,
} from "@mantine/core";
import { IconBrandTelegram } from "@tabler/icons-react";
import { Markdown } from "@/webview/pureComponents";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  calPromptActionMessages,
  requestPromptApi,
} from "@/webview/services/openAI/apiConfig";
import { setPromptIsResponsing } from "@/webview/reducers/promptSlice";
import type { Prompt } from "@/database/models/Prompt";
import { createDebounce } from "@/webview/utils/debounce";

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
  const { colorScheme } = useMantineTheme();

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

  const codeScope = useAppSelector(
    (state) => state.settings.markdown_code_scope
  );

  const [statTokens, setStatTokens] = useState(0);

  const calTokensDebounce = useCallback(
    createDebounce((event: ChangeEvent<HTMLTextAreaElement>) => {
      setStatTokens(
        selectedPrompt
          ? window.electronAPI.othersIpcRenderer.calMessagesTokens(
              calPromptActionMessages(selectedPrompt.prompt, event.target.value)
            )
          : 0
      );
    }, 500),
    [selectedPrompt]
  );

  return (
    <>
      {selectedPrompt && (
        <div className="flex flex-1 flex-col p-2 pb-4 px-4 overflow-y-scroll chat-messages-view overflow-x-hidden relative h-full">
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
              size="xs"
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
              onChange={(event) => {
                setInputContent(event.currentTarget.value);
                calTokensDebounce(event);
              }}
            ></Textarea>
            <div className="w-full flex mt-1 justify-end">
              <div className="flex items-center justify-end">
                <div className="text-sm text-gray-500 mr-2 font-greycliff tracking-wide">
                  {`${statTokens} tokens`}
                </div>
                <ActionIcon type="submit">
                  <IconBrandTelegram className="text-violet-500" size={18} />
                </ActionIcon>
              </div>
            </div>
          </form>
          <div
            className={clsx(
              "p-3 rounded-lg mt-1",
              colorScheme === "dark" ? "bg-dark-750" : "bg-gray-100",
              !answerContent && "bg-transparent"
            )}
          >
            {answerContent && (
              <Text size="xs" weight="bold">
                Output:{" "}
              </Text>
            )}
            <div className="text-xs">
              <Markdown
                colorScheme={colorScheme}
                text={answerContent}
                codeScope={codeScope
                  .split(",")
                  .map((language) => language.trim())}
              />
            </div>
            {isPromptResponsing ? (
              <Loader variant="dots" color="violet" size="sm" />
            ) : null}
            {isPromptResponsing && (
              <div
                className="sticky bottom-0 z-10 bg-transparent flex justify-center"
                onClick={() => {
                  dispatch(setPromptIsResponsing(false));
                }}
              >
                <Button radius="lg" size="xs" color="violet">
                  Stop Generation
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
