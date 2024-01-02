import { AddressSet, User } from "../models/index.js";

async function getAddress(interaction, blockchainAddress = "algorandAddress") {
  try {
    // Fetch users by userId
    const users = await User.findAll({
      where: { userId: interaction.user.id },
    });

    // Check if users were found
    if (users.length > 0) {
      // Since 'users' is an array, we need to extract the IDs of all the user records.
      // This creates an array of user IDs.
      const userIds = users.map((user) => user.id);

      // Now, fetch address sets for all those user IDs.
      const addressSets = await AddressSet.findAll({
        where: { userId: userIds },
      });

      return addressSets[0].dataValues[`${blockchainAddress}`];
    } else {
      console.log("No users found with the provided userId");
      return null;
    }
  } catch (error) {
    console.log("User address DB error: ", error);
    return null;
  }
}

export { getAddress };
