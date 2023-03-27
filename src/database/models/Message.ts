import { DataTypes } from "sequelize";

export interface Message {
  id?: number;
  text: string;
  sender: "system" | "assistant" | "user";
  timestamp: number;
  chatId: number;
  inPrompts?: boolean;
  actionResult?: string;
}

const MessageDefine = {
  name: "Message",
  model: {
    sender: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    chatId: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
  },
};
export { MessageDefine };
