import { verifyNFT } from "../algorand/verifyNFT.js";
import { getUserAddress } from "../state/index.js";
import {
  createVerifyV1NFTSuccessEmbed,
  createVerifyV2NFTSuccessEmbed,
  createVerifyNFTFailureEmbed,
  sendSetAddressReminderForNFTVerificationEmbed,
} from "../embeds/index.js";

import { AddressSet, User } from "../db/models/index.js";
import { DB } from "../db/config/index.js";

import fs from "fs/promises";
import path from "path";

async function handleNFTVerification(interaction, userChoice) {
  let userAddress = getUserAddress(interaction.user.id);
  // Fetch users by userId
  const users = await User.findAll({ where: { userId: interaction.user.id } });

  // Check if users were found
  if (users.length > 0) {
    // Since 'users' is an array, we need to extract the IDs of all the user records.
    // This creates an array of user IDs.
    const userIds = users.map((user) => user.id);

    // Now, fetch address sets for all those user IDs.
    const addressSets = await AddressSet.findAll({
      where: { userId: userIds },
    });

    userAddress = addressSets[0].dataValues.algorandAddress;
  } else {
    console.log("No users found with the provided userId");
  }
  if (userAddress) {
    try {
      const isValid = await verifyNFT(userAddress);

      if (isValid) {
        await addVerifiedUserAddress(userAddress);

        return userChoice === "versionOne"
          ? { verifynftEmbed: createVerifyV1NFTSuccessEmbed(), isValid }
          : { verifynftEmbed: createVerifyV2NFTSuccessEmbed(), isValid };
      } else {
        return {
          verifynftEmbed: createVerifyNFTFailureEmbed(),
          isValid,
        };
      }
    } catch (error) {
      console.error("Error sending Algo:", error);
      return {
        verifynftEmbed: createVerifyNFTFailureEmbed(
          error.message || "An unexpected error occurred."
        ),
        isValid: false,
      };
    }
  } else {
    return {
      verifynftEmbed: sendSetAddressReminderForNFTVerificationEmbed(),
      isValid: false,
    };
  }
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

export { handleNFTVerification };
