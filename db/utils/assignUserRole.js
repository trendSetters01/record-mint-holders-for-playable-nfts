import { DB } from "../config/index.js";
import { RoleType, RoleBoost, UserRole } from "../models/index.js";

async function assignUserRole(user, roleTypeId) {
  const transaction = await DB.transaction();
  try {
    // Fetch the role type ID based on the RoleType id
    const roleType = await RoleType.findOne({ where: { id: roleTypeId } });

    if (!roleType) {
      throw new Error("Role type not found.");
    }

    const roleBoost = await RoleBoost.findOne({
      where: { roleId: roleType.id },
    });

    const userId = user.dataValues.userId;

    // Find or create a user role
    const [userRole, created] = await UserRole.findOrCreate({
      where: { userId: userId, roleId: roleType.id },
      defaults: {
        userId: userId,
        roleId: roleType.id,
        boostId: roleBoost.id,
      },
      transaction: transaction,
    });

    await transaction.commit();
    return userRole;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}

export { assignUserRole };
