import { EmbedBuilder } from "discord.js";

import { verifyNFT } from "../../algorand/assignRole/verifyForRole.js";
import { sendAssetToUser } from "../../algorand/assignRole/sendAssetToUser.js";
import {
  createUserOrUpdateAddressSet,
  assignUserRole,
} from "../../db/utils/index.js";
import { DB } from "../../db/config/index.js";
import { pollForOptIn } from "../../utils/index.js";
import { createEmbedForRole, invalidRequestEmbed } from "../../embeds/index.js";

async function handleAssignrole(interaction) {
  const userId = interaction.user.id;
  const userAddress = interaction.options.getString("address");
  const role = interaction.options.getString("role");

  const transaction = await DB.transaction();

  try {
    const isValid = await verifyNFT(userAddress, role);
    if (!isValid) {
      await interaction.reply({
        embeds: [invalidRequestEmbed()],
      });
      return;
    }
    const user = await createUserOrUpdateAddressSet(
      userId,
      userAddress,
      transaction
    );
    if (user) {
      await processUserVerification(user, userAddress, role, interaction);
    }
  } catch (error) {
    console.error("Error in NFT verification:", error);
    await transaction.rollback();
    await replyWithError(interaction, error);
  }
}

async function processUserVerification(user, userAddress, role, interaction) {
  const rolesToAssetId = {
    Singlev1: "1247047572",
    Fourv1: "1247052279",
    Fivev1: "1247046654",
    // Singlev1: "1247018740",
  };

  const verifynftEmbed = createEmbedForRole(role, rolesToAssetId);
  await interaction.reply({ embeds: [verifynftEmbed] });

  const assetId = rolesToAssetId[role];
  const interval = 30000; // 30 seconds
  const duration = 5 * 60 * 1000; // 5 minutes

  const optedIn = await pollForOptIn(
    userAddress,
    assetId,
    interval,
    duration,
    interaction
  );
  if (optedIn) {
    // Update or assign the user role in the database
    await assignUserRole(user, role);

    // Update or assign the user role in discord
    await interaction.member.roles.add(
      `${
        {
          Singlev1: "1176446283465097237",
          Fourv1: "1176446363135918110",
          Fivev1: "1176445906967613550",
          // Singlev1: "1175962773512015903",
          // Tenv1: 4,
          // Fifteenv1: 5,
          // Tweentyv1: 6,
          // Singlev2: 7,
          // Fivev2: 8,
          // Tenv2: 9,
          // Fifteenv2: 10,
          // Tweentyv2: 11,
          // Add other roles here
        }[role]
      }`
    );

    // send the role token to the user
    await sendAssetToUser(userAddress, assetId, 1);
  }
}

async function replyWithError(interaction, error) {
  await interaction.followUp({
    embeds: [
      new EmbedBuilder()
        .setColor(16711680)
        .setTitle("Error in NFT verification")
        .setDescription(error.message),
    ],
  });
}

export { handleAssignrole };
