import { EmbedBuilder } from "discord.js";

import fs from "fs/promises";
import path from "path";

import { verifyNFT } from "../../algorand/assignRole/verifyForRole.js";
import { checkOptIn } from "../../algorand/assignRole/checkOptin.js";
import { sendAssetToUser } from "../../algorand/assignRole/sendAssetToUser.js";
import { AddressSet, User } from "../../db/models/index.js";
import { DB } from "../../db/config/index.js";
import { userAddressRegistration } from "../../utils/index.js";

async function handleAssignrole(interaction) {
  const userId = interaction.user.id;
  const userAddress = interaction.options.getString("address");
  const role = interaction.options.getString("role");

  const transaction = await DB.transaction();

  try {
    const isValid = await verifyNFT(userAddress, role);
    if (!isValid) {
      await replyInvalidRequest(interaction);
      return;
    }
    const user = await createUserOrUpdateAddressSet(
      userId,
      userAddress,
      transaction
    );
    if (user) {
      await processUserVerification(userAddress, role, interaction);
    }
  } catch (error) {
    console.error("Error in NFT verification:", error);
    await transaction.rollback();
    await replyWithError(interaction, error);
  }
}

async function createUserOrUpdateAddressSet(userId, userAddress, transaction) {
  const [user, created] = await User.findOrCreate({
    where: { userId: userId },
    transaction: transaction,
  });

  if (!user) return null;

  const [addressSet, wasCreated] = await AddressSet.findOrCreate({
    where: { userId: user.id, algorandAddress: userAddress },
    defaults: { algorandAddress: userAddress },
    transaction: transaction,
  });

  if (!wasCreated) {
    addressSet.algorandAddress = userAddress;
    await addressSet.save({ transaction: transaction });
  }

  await transaction.commit();
  await userAddressRegistration(userId, userAddress);
  await addVerifiedUserAddress(userAddress);

  return user;
}

async function processUserVerification(userAddress, role, interaction) {
  const rolesToAssetId = {
    Singlev1: "1247047572",
    Fourv1: "1247052279",
    Fivev1: "1247046654",
    // Singlev1: "1247018740",
    // Fourv1: "1247018740",
    // Fivev1: "1247018740",
    // Tenv1: 4,
    // Fifteenv1: 5,
    // Tweentyv1: 6,
    // Singlev2: 7,
    // Fivev2: 8,
    // Tenv2: 9,
    // Fifteenv2: 10,
    // Tweentyv2: 11,
    // Add other roles here
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
    await interaction.member.roles.add(
      `${
        {
          Singlev1: "1176446283465097237",
          Fourv1: "1176446363135918110",
          Fivev1: "1176445906967613550",
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
    await sendAssetToUser(userAddress, assetId, 1);
  }
}

function createEmbedForRole(role, rolesToAssetId) {
  switch (role) {
    case "Singlev1":
    case "Fourv1":
    case "Fivev1":
      return new EmbedBuilder()
        .setColor(16711680)
        .setTitle("You have been verified for the role")
        .setDescription(
          `Please optin (you can use /optin from phntm rewards bot) to asset ${rolesToAssetId[role]} and wait for the transaction to complete. ( max 5 minutes wait ) and receive your phantom role token`
        );
    default:
      return new EmbedBuilder()
        .setColor(16711680)
        .setTitle(
          "Please try again later or hop on Discord for more questions/answers"
        );
  }
}

async function replyInvalidRequest(interaction) {
  await interaction.reply({
    embeds: [new EmbedBuilder().setColor(16711680).setTitle("Invalid Request")],
  });
}

async function replyWithError(interaction, error) {
  await interaction.reply({
    embeds: [
      new EmbedBuilder()
        .setColor(16711680)
        .setTitle("Error in NFT verification")
        .setDescription(error.message),
    ],
  });
}

async function replyOptInFailed(interaction) {
  await interaction.followUp({
    embeds: [
      new EmbedBuilder()
        .setColor(16711680)
        .setTitle("Opt-in not detected")
        .setDescription("Please try opting in again."),
    ],
  });
}

// needs to be adjusted for different edge cases
// 1. user opts in but my app restarts before I can send the asset so the timer for the poll gets reset
async function pollForOptIn(address, assetId, interval, duration, interaction) {
  const endTime = Date.now() + duration;

  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        if (await checkOptIn(address, assetId)) {
          console.log("User has opted in!");
          resolve(true);
        } else if (Date.now() < endTime) {
          setTimeout(check, interval);
        } else {
          console.log("Polling time expired. User did not opt in.");
          resolve(false);
          await replyOptInFailed(interaction);
        }
      } catch (error) {
        reject(error);
      }
    };

    check();
  });
}

async function addVerifiedUserAddress(userAddress) {
  // Specify the directory path
  const dirPath = path.resolve("algorand", "phantomAssets", "addresses");
  const filePath = path.join(dirPath, "phantomVerifiedUserAddresses.txt");

  try {
    // Check if the directory exists; if not, it will throw an error
    await fs.access(dirPath);

    // Read the current contents of the file
    const data = await fs.readFile(filePath, "utf8");

    // Split the contents by new line and remove any carriage return characters
    const addresses = data
      .split("\n")
      .map((address) => address.trim().replace("\r", ""));
    // Check if the address already exists in the array
    if (!addresses.includes(userAddress.trim())) {
      // Address doesn't exist, so append it to the file
      await fs.appendFile(filePath, `\n${userAddress}`);
      console.log("The nft verified address was appended to the file!");
    } else {
      console.log(
        "handleNFTVerification: The nft verified address already exists in the file. No action taken."
      );
    }
  } catch (error) {
    console.error(
      "handleNFTVerification: Error handling the NFT verified address registration:",
      error
    );
  }
}

export { handleAssignrole };
