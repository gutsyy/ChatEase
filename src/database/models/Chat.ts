import { DataTypes } from "sequelize";

export interface Chat {
  id?: number;
  name: string;
  timestamp?: number;
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
  },
};

export { ChatDefine };
