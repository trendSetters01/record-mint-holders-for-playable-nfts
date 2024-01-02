import {
  createSetAddressFailureEmbed,
} from "../../embeds/index.js";

import { AddressSet, User } from "../../db/models/index.js";
import { DB } from "../../db/config/index.js";

import { userAddressRegistration } from "../../utils/index.js";
import { handleNFTVerification } from "../../utils/handleNFTVerification.js";
import algosdk from "algosdk";

async function handleSetaddress(interaction) {
  const address = interaction.options.getString("address");
  const assetId = interaction.options.getString("assetid");
  const userId = interaction.user.id;
  if (!algosdk.isValidAddress(address)) {
    const failureEmbed = createSetAddressFailureEmbed(
      "Invalid Algorand address provided."
    );
    console.error(
      "createSetAddressFailureEmbed: Invalid to Algorand address provided."
    );
    await interaction.reply({ embeds: [failureEmbed], ephemeral: true });
  } else {
    await interaction.deferReply();
    // Start a transaction
    const t = await DB.transaction();

    try {
      // Check if the user exists or create a new one
      const [user, created] = await User.findOrCreate({
        where: { userId: userId },
        transaction: t,
      });

      // If we have a valid user, we can proceed to create or update the AddressSet
      if (user) {
        const [addressSet, wasCreated] = await AddressSet.findOrCreate({
          where: { userId: user.id, algorandAddress: address }, // adjust conditions as needed
          defaults: { algorandAddress: address },
          transaction: t,
        });

        if (!wasCreated) {
          // If the record was not created, it means it already exists, so we might want to update it
          addressSet.algorandAddress = address; // and other fields that need to be updated
          await addressSet.save({ transaction: t });
        }

        // If everything was successful, commit the transaction
        await t.commit();

        await userAddressRegistration(userId, address);

        const { verifynftEmbed, isValid } = await handleNFTVerification(
          address,
          assetId,
          "versionOne"
        );

        if (isValid) {
          try {
            await interaction.member.roles.add("1145372070553845770");
          } catch (error) {
            console.log("attempted role add failed", error);
          }
        }

        try {
          await interaction.followUp({ embeds: [verifynftEmbed] });
        } catch (error) {
          console.log("embed", verifynftEmbed, error);
        }
      } else {
        throw new Error("User could not be created or found.");
      }
    } catch (error) {
      console.error("Error with upsert operation:", error);

      // If there was an error, roll back the transaction
      await t.rollback();

      // Here, we reply to the interaction with the failure embed, providing the error message.
      const failureEmbed = createSetAddressFailureEmbed(
        (error.message && "Algorand address verification failed") ||
          "An unexpected error occurred."
      );
      console.error("createSetAddressFailureEmbed: ", error.message);
      await interaction.reply({ embeds: [failureEmbed], ephemeral: true });
    }
    // await logUsersAndAddressSets(userId);
  }
}

async function logUsersAndAddressSets(userId) {
  const users = await User.findAll({ where: { userId } });
  const addressSets = await AddressSet.findAll({
    where: {
      algorandAddress:
        "YX752U7VQWF7JDB3HWFBOJUYNV6ST2VZSCLH4XMZXZGUEIHLU4ZRTY723E",
    },
  });
  console.log(users, "\n", "\n", addressSets);
}

export { handleSetaddress };
