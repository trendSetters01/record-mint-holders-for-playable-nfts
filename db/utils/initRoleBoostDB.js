import DB from "../models/index.js";
import { RoleBoost } from "../models/index.js";

async function initializeRoleBoosts() {
  const roleBoosts = [
    {
      roleId: 0,
      boostType: "Administrator",
      boostValue: null,
    },
    {
      roleId: 1, // Assuming this ID exists in your RoleType table
      boostType: "Staking Reward Multiplier",
      boostValue: 0.1, // Example boost value
    },
    {
      roleId: 2,
      boostType: "Staking Reward Multiplier",
      boostValue: 0.5,
    }
    // Add more boosts as needed
  ];

  const transaction = await DB.transaction();
  try {
    for (const roleBoost of roleBoosts) {
      await RoleBoost.findOrCreate({
        where: { roleId: roleBoost.roleId, boostType: roleBoost.boostType },
        defaults: roleBoost,
        transaction: transaction,
      });
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.error("Failed to initialize role boosts:", error);
  }
}

// Call this function at the appropriate place in your application's initialization phase
initializeRoleBoosts();
