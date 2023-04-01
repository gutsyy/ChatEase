import { TextInput, ActionIcon, useMantineTheme } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useState, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../hooks/redux";
import { setChats } from "../../reducers/chatSlice";

const SearchingInput = () => {
  const dispatch = useAppDispatch();
  const [keywords, setKeywords] = useState<string>("");
  const { t } = useTranslation();
  const { colorScheme } = useMantineTheme();

  const onSearching = (e: FormEvent) => {
    e.preventDefault();
    window.electronAPI.databaseIpcRenderer
      .searchChats(keywords)
      .then((chats) => {
        dispatch(setChats(chats));
      });
  };

  return (
    <form className="mt-2" onSubmit={onSearching}>
      <TextInput
        size="xs"
        variant="filled"
        styles={
          colorScheme === "light" && {
            input: {
              background: "white",
            },
          }
        }
        placeholder={t("sideExtend_chat_searching")}
        rightSection={
          <ActionIcon type="submit" radius="lg">
            <IconSearch size={16} />
          </ActionIcon>
        }
        onChange={(e) => setKeywords(e.currentTarget.value)}
      />
    </form>
  );
};

export default SearchingInput;
