import { DB, DataTypes } from "../config/index.js";

// StakingAssets model
const StakingAssets = DB.define("StakingAssets", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  stakingSetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      notEmpty: true,
      // Add any specific validations for the format of user IDs if necessary
    },
    references: {
      model: "StakingSet", // Ensure this matches the table name for the StakingSet model
      key: "id",
    },
  },
  assetId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
      min: 1, // Ensure that the amount is at least 1
    },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export { StakingAssets };
