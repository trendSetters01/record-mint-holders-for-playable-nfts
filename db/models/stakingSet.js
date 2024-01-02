import { DB, DataTypes } from "../config/index.js";

const StakingSet = DB.define("StakingSet", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'User',
      key: 'userId'
    }
  },
  addressId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'AddressSet',
      key: 'id'
    }
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
      min: 1
    }
  },
  durationType: {
    type: DataTypes.ENUM('days', 'weeks', 'months'),
    allowNull: false,
    defaultValue: 'weeks'
  },
  startDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  endDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'completed', 'cancelled'),
    allowNull: false,
    defaultValue: 'active'
  },
  boostFactor: {
    type: DataTypes.FLOAT,
    allowNull: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

export { StakingSet };
