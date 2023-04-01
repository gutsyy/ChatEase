import { Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import ScrollableList from "../../pureComponents/ScrollableList";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { openPromptFormModal } from "./modals/promptFormModal";
import { useEffect, useRef } from "react";
import { PromptListItem } from "./PromptListItem";
import { getAllPrompts } from "../../reducers/promptSlice";
import { useTranslation } from "react-i18next";

export const PromptsList = () => {
  const dispatch = useAppDispatch();
  const prompts = useAppSelector((state) => state.prompt.prompts);
  const listContainterRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

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
        gradient={{ from: "violet", to: "indigo" }}
        leftIcon={<IconPlus size={18} />}
        onClick={() => openPromptFormModal()}
      >
        {t("sideExtend_prompt_newPrompt")}
      </Button>
      <div className="flex-1 mt-2" ref={listContainterRef}>
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
