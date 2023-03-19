import { DataTypes } from "sequelize";

export interface Prompt {
  id?: number;
  name: string;
  prompt: string;
  declare: string;
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
    declare: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
};

export { PromptDefine };
