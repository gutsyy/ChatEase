import { useEffect, useState } from "react";
import {
  DragDropContext,
  OnDragEndResponder,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import { clsx, Textarea, useMantineTheme } from "@mantine/core";
import { Prompt } from "../../../database/models/Prompt";
import { IconBrandTelegram, IconMessage2 } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

export const ChatToolbarSettings = () => {
  const [allActions, setAllActions] = useState<Prompt[]>([]);
  const [selectedActions, setSelectedActions] = useState<Prompt[]>([]);
  const { t } = useTranslation();
  const { colorScheme } = useMantineTheme();

  useEffect(() => {
    const selectedActionIds = window.electronAPI.storeIpcRenderer.get(
      "chat_input_toolbar_items"
    ) as number[];
    window.electronAPI.databaseIpcRenderer
      .getPromptsByIds(selectedActionIds)
      .then((prompts) => {
        setSelectedActions(prompts);
        window.electronAPI.databaseIpcRenderer
          .getAllPrompts()
          .then((allPrompts) => {
            setAllActions(
              allPrompts.filter((p) => !prompts.map((s) => s.id).includes(p.id))
            );
          });
      });
  }, []);

  const onDragEnd: OnDragEndResponder = (e) => {
    if (!e.source || !e.destination) {
      return;
    }
    if (
      e.destination.droppableId === "selectedActions" &&
      e.source.droppableId === "allActions"
    ) {
      const draggablePrompt = allActions[e.source.index];
      setAllActions((prev) => {
        return [
          ...prev.slice(0, e.source.index),
          ...prev.slice(e.source.index + 1),
        ];
      });
      setSelectedActions((prev) => {
        const newArr = [
          ...prev.slice(0, e.destination.index),
          draggablePrompt,
          ...prev.slice(e.destination.index),
        ];

        window.electronAPI.storeIpcRenderer.set(
          "chat_input_toolbar_items",
          newArr.map((p) => p.id)
        );
        return newArr;
      });
    }
    if (
      e.destination.droppableId === "allActions" &&
      e.source.droppableId === "selectedActions"
    ) {
      const draggablePrompt = selectedActions[e.source.index];
      setSelectedActions((prev) => {
        const newArr = [
          ...prev.slice(0, e.source.index),
          ...prev.slice(e.source.index + 1),
        ];
        window.electronAPI.storeIpcRenderer.set(
          "chat_input_toolbar_items",
          newArr.map((p) => p.id)
        );
        return newArr;
      });
      setAllActions((prev) => {
        return [
          ...prev.slice(0, e.destination.index),
          draggablePrompt,
          ...prev.slice(e.destination.index),
        ];
      });
    }
    if (
      e.destination.droppableId === "selectedActions" &&
      e.source.droppableId === "selectedActions"
    ) {
      setSelectedActions((prev) => {
        const arr = [...prev];
        const [removed] = arr.splice(e.source.index, 1);
        arr.splice(e.destination.index, 0, removed);
        window.electronAPI.storeIpcRenderer.set(
          "chat_input_toolbar_items",
          arr.map((p) => p.id)
        );
        return arr;
      });
    }
  };

  return (
    <div className="w-full">
      <div className="text-sm font-greycliff font-bold">
        {t("settings_chatToolbar_selectableActions")}
      </div>
      <div className="text-xs text-gray-400 mb-1">
        {t("settings_chatToolbar_selectableActions_help")}
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="allActions" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              className={clsx(
                "flex whitespace-nowrap gap-1 py-1 px-1 rounded overflow-x-auto h-8",
                colorScheme === "dark" ? "bg-dark-600" : "bg-gray-100"
              )}
              style={{ maxWidth: "620px" }}
              {...provided.droppableProps}
            >
              {allActions.map((action, index) => (
                <Draggable
                  key={action.id}
                  draggableId={action.id + ""}
                  index={index}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      className={clsx(
                        "py-1 px-3 text-xs font-greycliff text-white rounded-full",
                        colorScheme === "dark" ? "bg-dark-900" : "bg-gray-300"
                      )}
                      {...provided.dragHandleProps}
                      {...provided.draggableProps}
                    >
                      {action.name}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div className="text-sm font-greycliff font-bold mt-4">
          {t("settings_chatToolbar_SelectedActions")}
        </div>
        <div className="text-xs text-gray-400 mb-1">
          {t("settings_chatToolbar_SelectedActions_help")}
        </div>
        <div
          className={clsx(
            "p-2 rounded",
            colorScheme === "dark" ? "bg-dark-700" : "bg-white"
          )}
        >
          <Droppable droppableId="selectedActions" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                className={clsx(
                  "flex whitespace-nowrap gap-1 py-1 px-1 rounded overflow-x-auto h-8",
                  colorScheme === "dark" ? "bg-dark-500" : "bg-gray-100"
                )}
                style={{ maxWidth: "620px" }}
                {...provided.droppableProps}
              >
                {selectedActions.map((action, index) => (
                  <Draggable
                    key={action.id}
                    draggableId={action.id + ""}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        className="py-1 px-3 text-xs font-greycliff bg-purple-400 text-white rounded-full"
                        {...provided.dragHandleProps}
                        {...provided.draggableProps}
                      >
                        {action.name}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <div className="flex w-full items-center gap-1 mt-2">
            <IconMessage2 size={18} className="text-gray-500" />
            <Textarea className="flex-1" minRows={1} disabled></Textarea>
            <IconBrandTelegram size={18} className="text-gray-500" />
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};
