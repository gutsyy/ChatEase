import { DataTypes } from "sequelize";
import { OpenAIModels } from "@/webview/services/openAI/data";

export interface Chat {
  id?: number;
  name: string;
  timestamp?: number;
  tokensLimit?: number;
  messagesLimit?: number;
  temperature?: number;
  model?: OpenAIModels;
  costTokens?: number;
  pinnedSetting?: string;
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
      defaultValue: "gpt-3.5-turbo",
      allowNull: true,
    },
    costTokens: {
      type: DataTypes.BIGINT,
      defaultValue: 0,
    },
    pinnedSetting: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
  },
};

export { ChatDefine };
