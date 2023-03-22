import { TextInput, ActionIcon } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { useState, FormEvent } from "react";
import { useAppDispatch } from "../../hooks/redux";
import { setChats } from "../../reducers/app";

const SearchingInput = () => {
  const dispatch = useAppDispatch();

  const [keywords, setKeywords] = useState<string>("");

  const onSearching = (e: FormEvent) => {
    e.preventDefault();
    dispatch(
      setChats(window.electronAPI.databaseIpcRenderer.searchChats(keywords))
    );
  };

  return (
    <form className="mt-2" onSubmit={onSearching}>
      <TextInput
        size="xs"
        variant="filled"
        styles={{
          input: {
            background: "white",
          },
        }}
        placeholder="Searching..."
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
