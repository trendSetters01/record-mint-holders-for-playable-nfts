import {
  User,
  AddressSet,
  StakingSet,
  StakingAssets,
  UserRole,
  RoleBoost,
} from "../../db/models/index.js";
import { DB } from "../../db/config/index.js";
import { EmbedBuilder } from "discord.js";
import { verifySpecificPhntmNFT } from "../../algorand/verifyNFT.js";
import { userAddressRegistration } from "../../utils/index.js";

async function handleRegisterstake(interaction) {
  const address = interaction.options.getString("address");
  const assetIds = [
    interaction.options.getString("assetid1"),
    interaction.options.getString("assetid2"),
    interaction.options.getString("assetid3"),
    interaction.options.getString("assetid4"),
    interaction.options.getString("assetid5"),
  ];
  const durationType = interaction.options.getString("durationtype");
  const duration = interaction.options.getInteger("duration");
  const userId = interaction.user.id;

  // Start a transaction
  const t = await DB.transaction();

  try {
    // Verify that the user owns the specified NFTs
    const ownsNFT = await verifySpecificPhntmNFT(address, assetIds);
    if (!ownsNFT) {
      throw new Error("One or more asset IDs do not match any known NFTs.");
    }

    // Find or create a user and address set in the database
    const [user, userCreated] = await User.findOrCreate({
      where: { userId: userId },
      transaction: t,
    });

    const [addressSet, addressSetCreated] = await AddressSet.findOrCreate({
      where: { userId: user.id, algorandAddress: address },
      defaults: { algorandAddress: address },
      transaction: t,
    });

    // Create a new staking set
    const stakingSet = await StakingSet.create(
      {
        addressSetId: addressSet.id,
        duration: duration,
        durationType: durationType,
        status: "active",
      },
      { transaction: t }
    );

    // Assign the assets to the staking set
    for (let assetId of assetIds) {
      await StakingAssets.create(
        {
          stakingSetId: stakingSet.id,
          assetId: assetId,
        },
        { transaction: t }
      );
    }

    // Find any role boosts associated with the user and apply them
    const userRoles = await UserRole.findAll({
      where: { userId: user.id },
      include: [{ model: RoleBoost }],
      transaction: t,
    });

    for (const userRole of userRoles) {
      const roleBoosts = userRole.RoleBoosts;
      for (const roleBoost of roleBoosts) {
        // Apply the boost value to the staking set. Adjust as needed for your boost logic.
        stakingSet.boostFactor += roleBoost.boostValue || 0;
      }
    }
    await stakingSet.save({ transaction: t });

    // Commit the transaction
    await t.commit();

    // Log the address
    await userAddressRegistration(userId, address);

    // Reply with success message
    const stakeRegistrationEmbed = new EmbedBuilder()
      .setColor(16711680)
      .setTitle("Stake Registration Success")
      .setDescription("Your NFTs have been successfully staked.");
    await interaction.reply({ embeds: [stakeRegistrationEmbed] });
  } catch (error) {
    console.error("Error in staking registration:", error);

    // Roll back the transaction
    await t.rollback();

    // Reply with failure message
    const failureEmbed = new EmbedBuilder()
      .setColor(16711680)
      .setTitle("Error")
      .setDescription(
        error.message ||
          "An unexpected error occurred during staking registration."
      );
    await interaction.reply({ embeds: [failureEmbed], ephemeral: true });
  }
}

export { handleRegisterstake };

// async function logUsersAndAddressSets(userId) {
//   const users = await User.findAll();
//   const addressSets = await AddressSet.findAll();
//   const stakingSets = await StakingSet.findAll();
//   console.log(users, "\n", "\n", addressSets, "\n", "\n", stakingSets);
// }
