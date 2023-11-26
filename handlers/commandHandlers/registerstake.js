import {
  User,
  AddressSet,
  StakingSet,
  StakingAssets,
} from "../../db/models/index.js";
import { DB } from "../../db/config/index.js";
import { EmbedBuilder } from "discord.js";
import { verifySpecificPhntmNFT } from "../../algorand/verifyNFT.js";
import { userAddressRegistration } from "../../utils/index.js";

async function handleRegisterstake(interaction) {
  const address = interaction.options.getString("address");
  const assetId1 = interaction.options.getString("assetid1");
  const assetId2 = interaction.options.getString("assetid2");
  const assetId3 = interaction.options.getString("assetid3");
  const assetId4 = interaction.options.getString("assetid4");
  const assetId5 = interaction.options.getString("assetid5");
  const assetIds = [assetId1, assetId2, assetId3, assetId4, assetId5];
  const durationType = interaction.options.getString("durationtype");
  const duration = interaction.options.getInteger("duration");
  const userId = interaction.user.id;

  // Start a transaction
  const t = await DB.transaction();

  try {
    // Verify that the user owns the specified NFT
    const ownsNFT = await verifySpecificPhntmNFT(address, assetIds);
    if (!ownsNFT) {
      throw new Error(
        "verifySpecificPhntmNFT ==> one or more asset ids dont match any known nfts."
      );
    }

    // Find or create a user and address set in your database
    const [user, userCreated] = await User.findOrCreate({
      where: { userId: userId },
      transaction: t,
    });

    const [addressSet, addressSetCreated] = await AddressSet.findOrCreate({
      where: { userId: user.id, algorandAddress: address },
      defaults: { algorandAddress: address },
      transaction: t,
    });

    // Create or update the StakingSet
    let stakingSet = await StakingSet.findOrCreate({
      where: { userId: user.id },
      defaults: {
        duration: duration,
        durationType: durationType,
        status: "active",
      },
      transaction: t,
    });

    for (const assetId of assetIds) {
      await StakingAssets.findOrCreate({
        where: { stakingSetId: stakingSet.id, assetId: assetId },
        defaults: { assetId: assetId },
        transaction: t,
      });
    }

    // Commit the transaction
    await t.commit();

    // Log the address
    await userAddressRegistration(userId, address);

    // Reply with success message
    const stakeRegistrationEmbed = new EmbedBuilder()
      .setColor(16711680)
      .setTitle("Stake Registration Success")
      .setDescription(`${"Staking registration completed successfully."}`);
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
        `${
          (error.message && "Staking registration failed") ||
          "An unexpected error occurred."
        }`
      );
    await interaction.reply({ embeds: [failureEmbed], ephemeral: true });
  }
  // await logUsersAndAddressSets(userId);
}
// async function logUsersAndAddressSets(userId) {
//   const users = await User.findAll();
//   const addressSets = await AddressSet.findAll();
//   const stakingSets = await StakingSet.findAll();
//   console.log(users, "\n", "\n", addressSets, "\n", "\n", stakingSets);
// }

export { handleRegisterstake };
