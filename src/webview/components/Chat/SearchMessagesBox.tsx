import { Message } from "@/database/models/Message";
import { useAppSelector } from "@/webview/hooks/redux";
import { Dialog, Menu, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface SearchMessagesBoxProps {
  opened: boolean;
  menuRef: Dispatch<SetStateAction<HTMLDivElement>>;
}

export const SearchMessagesBox = forwardRef(
  (
    { opened, menuRef }: SearchMessagesBoxProps,
    ref: Dispatch<SetStateAction<HTMLDivElement>>
  ) => {
    const form = useForm({
      initialValues: {
        searchingContent: "",
      },
    });
    const inputRef = useRef<HTMLInputElement>(null);
    const [showResult, setShowResult] = useState<boolean>(false);
    const [resultMessages, setResultMessages] = useState<Message[]>([]);
    const chatId = useAppSelector((state) => state.chat.selectedChatId);

    const onSearch = (value: string) => {
      if (value) {
        window.electronAPI.databaseIpcRenderer
          .searchMessages(chatId, value)
          .then((messages: Message[]) => {
            setResultMessages(messages);
          });
      } else {
        setResultMessages([]);
      }
    };

    useEffect(() => {
      if (!opened) {
        setShowResult(opened);
      }
    }, [opened]);

    useEffect(() => {
      if (!form.values.searchingContent) {
        setResultMessages([]);
      }
    }, [form.values.searchingContent]);

    useEffect(() => {
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 200);
    }, [opened]);

    return (
      <div ref={menuRef}>
        <Menu
          shadow="md"
          width={340}
          opened={showResult}
          position="bottom-end"
          closeOnItemClick={false}
        >
          <Menu.Target>
            <Dialog
              ref={ref}
              opened={opened}
              withCloseButton={false}
              position={{ top: 10, right: 10 }}
              radius="md"
              styles={{
                root: {
                  padding: "0.5rem !important",
                },
              }}
            >
              <form
                onSubmit={form.onSubmit((values) => {
                  onSearch(values.searchingContent);
                  setShowResult(true);
                })}
              >
                <TextInput
                  ref={inputRef}
                  placeholder="Search messages..."
                  variant="filled"
                  {...form.getInputProps("searchingContent")}
                />
              </form>
            </Dialog>
          </Menu.Target>
          <Menu.Dropdown>
            {resultMessages.length === 0 && <Menu.Item>No Result</Menu.Item>}
            {resultMessages.map((message) => {
              return (
                <SearchResultItem
                  {...message}
                  keyword={form.values.searchingContent}
                />
              );
            })}
          </Menu.Dropdown>
        </Menu>
      </div>
    );
  }
);

const SearchResultItem = ({
  text,
  id,
  keyword,
}: Message & { keyword: string }) => {
  const renderText = useCallback(
    (keyword: string) => {
      const index = text.toLowerCase().indexOf(keyword.toLowerCase());
      if (index < 0) {
        return text;
      }
      const before = text.substring(0, index);
      const after = text.substring(index + keyword.length);
      const keywordHtml = `<span class="text-red-500">${keyword}</span>`;
      const beforeHtml = before.length > 9 ? `...${before.slice(-9)}` : before;
      const afterHtml = after.length > 9 ? `${after.slice(0, 9)}...` : after;
      return `${beforeHtml}${keywordHtml}${afterHtml}`;
    },
    [text]
  );

  const scrollToMessage = () => {
    const item = document.getElementById("message-" + id);
    if (item) {
      item.scrollIntoView({ behavior: "smooth", block: "center" });
      const innerHTML = item.innerHTML;
      if (keyword.length === 1) return;
      const re = new RegExp(keyword, "gi");
      item.innerHTML = item.innerHTML.replace(
        re,
        `<span class="text-white bg-violet-500 mx-1">${keyword}</span>`
      );
      setTimeout(() => {
        item.innerHTML = innerHTML;
      }, 1000);
    }
  };

  return (
    <Menu.Item>
      <div
        className="text-sm"
        dangerouslySetInnerHTML={{
          __html: renderText(keyword),
        }}
        onClick={() => scrollToMessage()}
      ></div>
    </Menu.Item>
  );
};
