import { DataTypes, Sequelize } from "sequelize";

export interface Message {
  id?: number;
  text: string;
  sender: "system" | "assistant" | "user";
  timestamp: number;
  chatId: number;
  inPrompts?: boolean;
  collapse?: boolean;
  actionResult?: string;
  fixedInPrompt?: boolean;
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
      unique: false,
      index: true,
    },
    collapse: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    fixedInPrompt: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
};

export function createMessageIns(sequelize: Sequelize) {
  return sequelize.define(MessageDefine.name, MessageDefine.model, {
    createdAt: false,
    updatedAt: false,
  });
}

export { MessageDefine };
