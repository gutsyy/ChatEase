import { ModelStatic, Model, Op, Sequelize } from "sequelize";
import { Chat } from "../models/Chat";

export function createChatRepo(
  ChatIns: ModelStatic<Model<any, any>>,
  MessageIns: ModelStatic<Model<any, any>>,
  sequelize: Sequelize
) {
  return {
    createChat: async (chat: Chat) => {
      const result = await ChatIns.create({ ...chat });
      return result.dataValues.id;
    },

    getAllChats: async () => {
      const chats = await ChatIns.findAll({
        order: [["timestamp", "DESC"]],
      });
      return chats.map((chat) => chat.dataValues);
    },

    updateChatName: async (id: number, name: string) => {
      const result = await ChatIns.update(
        { name: name },
        { where: { id: id } }
      );
      return result;
    },

    deleteChat: async (id: number) => {
      return sequelize.transaction(async (transaction) => {
        await MessageIns.destroy({ where: { chatId: id }, transaction });
        await ChatIns.destroy({ where: { id: id }, transaction });
      });
    },

    deleteAllChats: async () => {
      return await ChatIns.destroy({ where: {} });
    },

    searchChats: async (name: string) => {
      const chats = await ChatIns.findAll({
        where: {
          name: {
            [Op.like]: "%" + name + "%",
          },
        },
        order: [["timestamp", "DESC"]],
      });
      return chats.map((chat) => chat.dataValues);
    },

    /**
     * @return {Promise<Chat>}
     */
    updateChatFieldById: async (id: number, field: keyof Chat, value: any) => {
      await ChatIns.update({ [field]: value }, { where: { id: id } });
      const updatedChat = await ChatIns.findByPk(id);
      return updatedChat.dataValues;
    },

    getChatFieldById: async (id: number, field: keyof Chat) => {
      const result = await ChatIns.findByPk(id);
      return result.dataValues[field];
    },

    getChatById: async (id: number) => {
      const result = await ChatIns.findByPk(id);
      return result.dataValues;
    },
  };
}
