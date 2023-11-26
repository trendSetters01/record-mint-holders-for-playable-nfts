
import {
  createSetAddressSuccessEmbed,
  createSetAddressFailureEmbed,
} from "../../embeds/index.js";

import { AddressSet, User } from "../../db/models/index.js";
import { DB } from "../../db/config/index.js";

import {userAddressRegistration} from '../../utils/index.js'

import fs from "fs/promises";
import path from "path";

async function handleSetaddress(interaction) {
  const address = interaction.options.getString("address");
  const userId = interaction.user.id;

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

      const setAddressEmbed = createSetAddressSuccessEmbed(address);

      await interaction.reply({ embeds: [setAddressEmbed] });
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

async function logUsersAndAddressSets(userId) {
  //   const users = await User.findAll();
  // const addressSets = await AddressSet.findAll();
  // console.log(users, "\n", "\n", addressSets);
  // // Fetch users by userId
  // const users = await User.findAll({ where: { userId } });

  // // Check if users were found
  // if (users.length > 0) {
  //   // Since 'users' is an array, we need to extract the IDs of all the user records.
  //   // This creates an array of user IDs.
  //   const userIds = users.map((user) => user.id);

  //   // Now, fetch address sets for all those user IDs.
  //   const addressSets = await AddressSet.findAll({
  //     where: { userId: userIds },
  //   });

  //   console.log(users, "\n", "\n", addressSets);
  // } else {
  //   console.log("No users found with the provided userId");
  // }
}

export { handleSetaddress };
