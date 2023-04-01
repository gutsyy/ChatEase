import { useEffect, useState } from "react";
import {
  DragDropContext,
  OnDragEndResponder,
  Droppable,
  Draggable,
} from "react-beautiful-dnd";
import { Skeleton } from "@mantine/core";
import { Prompt } from "../../../database/models/Prompt";
import { useTranslation } from "react-i18next";

export const MessageToolbarSettings = () => {
  const [allActions, setAllActions] = useState<Prompt[]>([]);
  const [selectedActions, setSelectedActions] = useState<Prompt[]>([]);
  const { t } = useTranslation();

  useEffect(() => {
    const selectedActionIds = window.electronAPI.storeIpcRenderer.get(
      "message_toolbar_items"
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
          "message_toolbar_items",
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
          "message_toolbar_items",
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
          "message_toolbar_items",
          arr.map((p) => p.id)
        );
        return arr;
      });
    }
  };

  return (
    <div className="w-full">
      <div className="text-sm font-greycliff font-bold text-gray-900">
        {t("settings_message_selectableActions")}
      </div>
      <div className="text-xs text-gray-400 mb-1">
        {t("settings_message_selectableActions_help")}
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="allActions" direction="horizontal">
          {(provided) => (
            <div
              ref={provided.innerRef}
              className="flex whitespace-nowrap gap-1 py-1 px-1 bg-gray-100 rounded overflow-x-auto h-8"
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
                      className="py-1 px-3 text-xs font-greycliff bg-gray-300 text-white rounded-full"
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
        <div className="text-sm font-greycliff font-bold mt-4 text-gray-900">
          {t("settings_message_SelectedActions")}
        </div>
        <div className="text-xs text-gray-400 mb-1">
          {t("settings_message_SelectedActions_help")}
        </div>
        <div className="p-2 bg-gray-100 rounded w-full">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6" width={120}></Skeleton>
            <Droppable droppableId="selectedActions" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  className="flex flex-1 ml-2 whitespace-nowrap gap-1 py-1 px-1 bg-white rounded overflow-x-auto h-8"
                  style={{ maxWidth: "480px" }}
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
                          className="px-3 py-1 text-xs font-greycliff bg-blue-500 text-white rounded-full"
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
          </div>
          <Skeleton className="h-12 w-full mt-2"></Skeleton>
        </div>
      </DragDropContext>
    </div>
  );
};
