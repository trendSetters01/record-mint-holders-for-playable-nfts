import { DB } from "../config/index.js";
import { RoleType } from "../models/index.js";

async function initializeRoleTypes() {
  const roleTypes = [
    {
      id: 0,
      name: "Administrator",
      description: "Full access with administrative privileges.",
    },
    {
      id: 1,
      name: "Phantom Spark",
      description:
        "Basic membership or entry-level participation. Access to general members-only channels, voting rights in community polls",
    },
    {
      id: 2,
      name: "Spectral Flame",
      description:
        "Reward for active members or contributors.Access to premium channels, eligibility for special events or giveaways, increased voting power.",
    }
    // Add more roles as needed
  ];

  const transaction = await DB.transaction();
  try {
    for (const roleType of roleTypes) {
      await RoleType.findOrCreate({
        where: { id: roleType.id },
        defaults: roleType,
        transaction: transaction,
      });
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    console.error("Failed to initialize role types:", error);
  }
}

// Call this function at the appropriate place in your application's initialization phase
initializeRoleTypes();
