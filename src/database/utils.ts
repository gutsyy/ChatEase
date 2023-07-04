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

export async function catchError(
  asyncFn: (...args: any) => Promise<any>,
  ...args: any
) {
  try {
    return await asyncFn(...args);
  } catch (err) {
    if (err instanceof Error) {
      throw err;
    }
    if (typeof err === "string") {
      throw new Error(err);
    }
    throw new Error("Unknown error");
  }
}

export function camelToHyphen(camelCase: string) {
  return camelCase.replace(/([A-Z])/g, "-$1").toLowerCase();
}
