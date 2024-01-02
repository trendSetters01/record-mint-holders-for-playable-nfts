import { DB, DataTypes } from "../config/index.js";

const UserRole = DB.define("UserRole", {
  // In UserRole model
  roleId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "RoleType", // Ensure this matches the table name for the RoleType model
      key: "id",
    },
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      // Add any specific validations for the format of user IDs if necessary
    },
    references: {
      model: "User",
      key: "userId",
    },
  },
  boosId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: "RoleBoost", // Ensure this matches the table name for the RoleType model
      key: "id",
    },
  },
});

export { UserRole };
