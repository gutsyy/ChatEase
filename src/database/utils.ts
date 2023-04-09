import { Model, ModelStatic, Sequelize } from "sequelize";

export const syncOrCreateTableAndBulkCreateInitialDatas = async (
  sequelize: Sequelize,
  modelIns: ModelStatic<Model<any, any>>,
  initialDatas: any[]
) => {
  const isPromptTableExists = await modelIns.describe().catch(() => false);
  const re = await modelIns.sync();
  if (!isPromptTableExists) {
    return sequelize.transaction(async (transaction) => {
      await modelIns.bulkCreate(initialDatas, { transaction });
    });
  }
  return re;
};
