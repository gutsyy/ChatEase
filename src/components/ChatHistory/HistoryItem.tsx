import { Tooltip, TextInput, ActionIcon, Text } from "@mantine/core";
import { useClickOutside } from "@mantine/hooks";
import { openConfirmModal, closeAllModals } from "@mantine/modals";
import { IconPencilMinus, IconTrash } from "@tabler/icons-react";
import { memo, useState } from "react";
import { Chat } from "../../database/models/Chat";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { selectedChatChange, setChats, newChat } from "../../reducers/app";
import { renderDate } from "./renderDate";

const HistoryItem = memo(({ name, id }: Chat) => {
  const dispatch = useAppDispatch();

  const selectedChatId = useAppSelector((state) => state.app.selectedChatId);

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const ref = useClickOutside(() => setIsEditing(false));

  const [itemName, setItemName] = useState<string>(name);

  return (
    <>
      <Tooltip
        styles={{
          tooltip: {
            fontSize: "12px",
            maxWidth: "300px",
          },
        }}
        label={name}
        withArrow
        multiline
        position="right"
        openDelay={1000}
      >
        <div
          className={
            "w-full py-2 rounded-md hover:cursor-pointer " +
            (id === selectedChatId && "shadow text-white bg-white")
          }
          onClick={() => dispatch(selectedChatChange(id))}
        >
          <div className="w-full h-full flex items-center pl-2 whitespace-nowrap">
            {isEditing ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  window.electronAPI.databaseIpcRenderer.updateChatName(
                    id,
                    itemName
                  );
                  dispatch(
                    setChats(
                      window.electronAPI.databaseIpcRenderer.getAllChats()
                    )
                  );
                  renderDate.date = "";
                  setIsEditing(false);
                }}
              >
                <TextInput
                  ref={ref}
                  value={itemName}
                  className="mr-2"
                  styles={{
                    input: {
                      minHeight: "24px",
                      height: "24px",
                      letterSpacing: "0.3px",
                      paddingLeft: "4px",
                      paddingRight: "4px",
                      borderWidth: "0px",
                      borderBottomWidth: "1px",
                      borderRadius: "0px",
                      borderColor: "#e2e2e2",
                      lineHeight: "calc(1.5rem - 0.125rem)",
                      fontSize: "12px",
                    },
                  }}
                  onChange={(event) => {
                    renderDate.date = "";
                    setItemName(event.currentTarget.value);
                  }}
                />
              </form>
            ) : (
              <div
                className="text-xs text-gray-700 flex-1 text-ellipsis overflow-hidden"
                style={{ maxWidth: "170px", marginRight: "5px" }}
              >
                {name}
              </div>
            )}
            <div className="flex gap-1">
              <ActionIcon radius="xl" size="sm" color="blue">
                <IconPencilMinus
                  size={12}
                  onClick={() => {
                    setIsEditing(!isEditing);
                  }}
                />
              </ActionIcon>
              <ActionIcon radius="xl" size="sm" color="red">
                <IconTrash
                  size={12}
                  onClick={(event) => {
                    event.stopPropagation();
                    openConfirmModal({
                      title: "删除会话",
                      children: (
                        <Text size="sm">
                          确认要删除{" "}
                          <span className="text-red-500">{name}</span> 吗？
                        </Text>
                      ),
                      labels: { confirm: "删除", cancel: "取消" },
                      onCancel: () => closeAllModals(),
                      onConfirm: () => {
                        window.electronAPI.databaseIpcRenderer.deleteChat(id);
                        if (id === selectedChatId) {
                          dispatch(newChat());
                        }
                        dispatch(
                          setChats(
                            window.electronAPI.databaseIpcRenderer.getAllChats()
                          )
                        );
                      },
                    });
                  }}
                />
              </ActionIcon>
            </div>
          </div>
        </div>
      </Tooltip>
    </>
  );
});

export default HistoryItem;
