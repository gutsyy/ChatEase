import { TextInput, ActionIcon } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";
import { useAppDispatch } from "../../hooks/redux";
import { setChats } from "../../reducers/chatSlice";

const SearchingInput = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const onSearching = (value: string) => {
    window.electronAPI.databaseIpcRenderer.searchChats(value).then((chats) => {
      dispatch(setChats(chats));
    });
  };

  return (
    <TextInput
      size="xs"
      variant="filled"
      placeholder={t("sideExtend_chat_searching")}
      rightSection={
        <ActionIcon type="submit" radius="lg">
          <IconSearch size={16} />
        </ActionIcon>
      }
      onChange={(e) => onSearching(e.currentTarget.value)}
    />
  );
};

export default SearchingInput;
