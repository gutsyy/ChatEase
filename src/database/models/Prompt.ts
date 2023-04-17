import { DataTypes, Sequelize } from "sequelize";

export interface Prompt {
  id?: number;
  name: string;
  prompt: string;
  temperature: number;
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
      type: DataTypes.TEXT,
      allowNull: false,
    },
    temperature: {
      type: DataTypes.NUMBER,
      defautlValue: 1,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
};

export function createPromptIns(sequelize: Sequelize) {
  return sequelize.define(PromptDefine.name, PromptDefine.model, {
    createdAt: false,
    updatedAt: false,
  });
}

export { PromptDefine };
