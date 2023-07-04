import { Model, ModelStatic, Op } from "sequelize";
import { Message } from "../models/Message";

export function createMessageRepo(MessageIns: ModelStatic<Model<any, any>>) {
  return {
    createMessage: async (message: Message) => {
      const result = await MessageIns.create({ ...message });
      return result.dataValues;
    },

    getMessages: async (chatId: number) => {
      const result = await MessageIns.findAll({
        where: {
          chatId,
        },
      });
      return result.map((r) => r.dataValues);
    },

    deleteMessage: async (id: number) => {
      const result = await MessageIns.destroy({ where: { id: id } });
      return result;
    },

    /** toggle message expaned */
    setMessageCollapse: async (id: number, collapse: boolean) => {
      const result = await MessageIns.update(
        { collapse: collapse },
        { where: { id: id } }
      );
      return result;
    },

    /** update message field by id and return updated message  */
    updateMessageFieldById: async (
      id: number,
      field: keyof Message,
      value: any
    ) => {
      await MessageIns.update({ [field]: value }, { where: { id: id } });
      const updatedMessage = await MessageIns.findByPk(id);
      return updatedMessage.dataValues;
    },

    /** search messsages by message.text and message.chatId */
    searchMessages: async (chatId: number, text: string) => {
      const result = await MessageIns.findAll({
        where: {
          text: {
            [Op.like]: `%${text}%`,
          },
          chatId: chatId,
        },
      });
      return result.map((message) => message.dataValues);
    },
  };
}
