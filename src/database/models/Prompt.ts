import { DataTypes } from "sequelize";

export interface Prompt {
  id?: number;
  name: string;
  prompt: string;
  description: string;
}

const PromptDefine = {
  name: "Prompt",
  model: {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    prompt: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
};

export { PromptDefine };
