import { Tooltip } from "@mantine/core";
import { IconCloud, IconCloudOff, IconTrash } from "@tabler/icons-react";
import { Message } from "../../database/models/Message";
import { useAppDispatch } from "../../hooks/redux";
import { updateMessages, toggleMessagePrompt } from "../../reducers/app";

const MessageBar = ({ msg, index }: { msg: Message; index: number }) => {
  const dispatch = useAppDispatch();

  // 删除会话
  const onDelete = () => {
    window.electronAPI.databaseIpcRenderer.deleteMessage(msg.id);
    dispatch(updateMessages(msg.chatId));
  };

  const renderTime = (
    <div className="text-gray-500 text-xs">
      {new Date(msg.timestamp * 1000).toLocaleTimeString()}
    </div>
  );

  const renderActions = (
    <>
      <div
        className="ml-2 flex justify-center items-center"
        onClick={() => {
          dispatch(toggleMessagePrompt(index));
        }}
      >
        <Tooltip
          styles={{
            tooltip: {
              fontSize: "12px",
            },
          }}
          label={`${msg.inPrompts ? "In" : "Not in"} promps`}
          withArrow
        >
          {msg.inPrompts ? (
            <IconCloud className="text-blue-500" size={14} />
          ) : (
            <IconCloudOff className="text-gray-500" size={14} />
          )}
        </Tooltip>
      </div>
      <div className="mx-2 flex justify-center items-center">
        <Tooltip
          styles={{
            tooltip: {
              fontSize: "12px",
            },
          }}
          label="删除该会话"
          openDelay={800}
          withArrow
        >
          <IconTrash
            onClick={() => onDelete()}
            className="text-red-500 hover:cursor-pointer"
            size={14}
          />
        </Tooltip>
      </div>
    </>
  );

  const renderTokensCount = (
    <>
      {msg.inPrompts ? (
        <div className="text-xs text-white px-1 ml-2 rounded bg-green-500 mr-1">{`${window.electronAPI.othersIpcRenderer.calMessagesTokens(
          [
            {
              role: msg.sender,
              content: msg.text,
            },
          ],
          true
        )} tokens in prompt`}</div>
      ) : (
        <div className="text-xs text-white px-1 ml-2 rounded bg-gray-300 mr-1">{`${window.electronAPI.othersIpcRenderer.calMessagesTokens(
          [
            {
              role: msg.sender,
              content: msg.text,
            },
          ],
          true
        )} tokens`}</div>
      )}
    </>
  );

  return (
    <div className="flex-1 flex justify-between items-center">
      <div className="flex items-center">
        <>{renderTime}</>
        <>{renderTokensCount}</>
      </div>
      <div className="flex">{renderActions}</div>
    </div>
  );
};

export default MessageBar;
