import { ModelStatic, Model, Op } from "sequelize";
import { Prompt } from "../models/Prompt";

export function createPromptRepo(PromptIns: ModelStatic<Model<any, any>>) {
  return {
    createPrompt: async (prompt: Prompt) => {
      const result = await PromptIns.create({ ...prompt });
      return result.dataValues;
    },

    getAllPrompts: async () => {
      const result = await PromptIns.findAll();
      return result.map((r) => r.dataValues);
    },

    getPrompt: async (id: number) => {
      const prompt = await PromptIns.findByPk(id);
      return prompt.dataValues;
    },

    getPromptsByIds: async (ids: number[]) => {
      const prompts = await PromptIns.findAll({
        where: {
          id: ids,
        },
      });
      return prompts.map((p) => p.dataValues);
    },

    deletePrompt: async (id: number) => {
      const result = await PromptIns.destroy({ where: { id: id } });
      return result;
    },

    updatePrompt: async (id: number, prompt: Prompt) => {
      const result = await PromptIns.update(
        { ...prompt },
        { where: { id: id } }
      );
      return result;
    },

    /** update prompt field by id and return updated prompt  */
    updatePromptFieldById: async (
      id: number,
      field: keyof Prompt,
      value: any
    ) => {
      await PromptIns.update({ [field]: value }, { where: { id: id } });
      const updatedPrompt = await PromptIns.findByPk(id);
      return updatedPrompt.dataValues;
    },

    /** search prompts by prompt.text and prompt.chatId */
    searchPrompts: async (text: string) => {
      const result = await PromptIns.findAll({
        where: {
          text: {
            [Op.like]: `%${text}%`,
          },
        },
      });
      return result.map((prompt) => prompt.dataValues);
    },
  };
}
