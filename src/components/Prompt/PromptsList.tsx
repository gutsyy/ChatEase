import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import ScrollableList from "../../pureComponents/ScrollableList";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { openPromptFormModal } from "./modals/promptFormModal";
import { useEffect, useRef } from "react";
import { PromptListItem } from "./PromptListItem";
import { getAllPrompts } from "../../reducers/promptSlice";

export const PromptsList = () => {
  const dispatch = useAppDispatch();
  const prompts = useAppSelector((state) => state.prompt.prompts);
  const listContainterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(getAllPrompts());
  }, []);

  return (
    <div className="w-full h-full flex flex-col p-1">
      <Button
        styles={{
          root: {
            fontFamily: "Greycliff CF, sans serif",
            fontWeight: 700,
          },
        }}
        className="w-full"
        variant="gradient"
        gradient={{ from: "indigo", to: "cyan" }}
        leftIcon={<IconPlus size={18} />}
        onClick={() => openPromptFormModal()}
      >
        New Action
      </Button>
      <div className="flex-1" ref={listContainterRef}>
        {listContainterRef.current && (
          <ScrollableList
            dataList={prompts}
            renderItem={PromptListItem}
            containerRef={listContainterRef}
            itemHeight={38}
          ></ScrollableList>
        )}
      </div>
    </div>
  );
};
