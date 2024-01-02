import { DB, DataTypes } from "../config/index.js";

const RoleType = DB.define("RoleType", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    unique: true,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
});

export { RoleType };
