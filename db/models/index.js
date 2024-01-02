import { User } from "./user.js";
import { AddressSet } from "./addressSet.js";
import { StakingSet } from "./stakingSet.js";
import { StakingAssets } from "./stakingAssets.js";
import { UserRole } from "./userRole.js";
import { RoleBoost } from "./roleBoost.js";
import { RoleType } from "./roleType.js";

// Define the relationships between the models
User.hasMany(AddressSet, { foreignKey: "userId", onDelete: "CASCADE" });
AddressSet.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

AddressSet.hasMany(StakingSet, {
  foreignKey: "addressId",
  onDelete: "CASCADE",
});
StakingSet.belongsTo(AddressSet, {
  foreignKey: "addressId",
  onDelete: "CASCADE",
});

StakingSet.hasMany(StakingAssets, {
  foreignKey: "stakingSetId",
  onDelete: "CASCADE",
});
StakingAssets.belongsTo(StakingSet, {
  foreignKey: "stakingSetId",
});

User.hasMany(UserRole, { foreignKey: "userId", onDelete: "CASCADE" });
UserRole.belongsTo(User, { foreignKey: "userId", onDelete: "CASCADE" });

// UserRole and RoleBoost
UserRole.hasMany(RoleBoost, { foreignKey: "roleId", onDelete: "CASCADE" });
RoleBoost.belongsTo(UserRole, { foreignKey: "roleId", onDelete: "CASCADE" });

// StakingSet and RoleBoost (if applicable)
StakingSet.hasMany(RoleBoost, {
  foreignKey: "stakingSetId",
  onDelete: "CASCADE",
});
RoleBoost.belongsTo(StakingSet, {
  foreignKey: "stakingSetId",
  onDelete: "CASCADE",
});

// UserRole and RoleType
RoleType.hasMany(UserRole, { foreignKey: "roleId", onDelete: "CASCADE" });
UserRole.belongsTo(RoleType, { foreignKey: "roleId", onDelete: "CASCADE" });

export {
  User,
  AddressSet,
  StakingSet,
  StakingAssets,
  UserRole,
  RoleType,
  RoleBoost,
};
