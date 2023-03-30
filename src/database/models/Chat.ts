import { DataTypes } from "sequelize";

export interface Chat {
  id?: number;
  name: string;
  timestamp?: number;
  tokensLimit?: number;
  messagesLimit?: number;
  temperature?: number;
  model?: string;
}

const ChatDefine = {
  name: "Chat",
  model: {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    timestamp: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    tokensLimit: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    messagesLimit: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    temperature: {
      type: DataTypes.NUMBER,
      allowNull: true,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
};

export { ChatDefine };
