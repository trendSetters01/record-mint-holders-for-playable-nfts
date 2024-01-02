import { DB, DataTypes } from "../config/index.js";

const RoleBoost = DB.define("RoleBoost", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "RoleType", // Ensure this matches the table name for the UserRole model
      key: "id",
    },
  },
  boostType: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: { notEmpty: true },
  },
  boostValue: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
});

export { RoleBoost };
