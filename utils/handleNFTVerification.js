import { verifyNFT } from "../algorand/verifyNFT.js";
import { getUserAddress } from "../state/index.js";
import {
  createVerifyV1NFTSuccessEmbed,
  createVerifyV2NFTSuccessEmbed,
  createVerifyNFTFailureEmbed,
  sendSetAddressReminderForNFTVerificationEmbed,
} from "../embeds/index.js";
import fs from "fs/promises";
import path from "path";

async function handleNFTVerification(interaction, userChoice) {
  const userAddress = getUserAddress(interaction.user.id);

  if (userAddress) {
    try {
      const isValid = await verifyNFT(userAddress);

      if (isValid) {
        // Specify the directory path
        const dirPath = path.resolve("algorand", "phantomAssets", "addresses");
        const filePath = path.join(dirPath, "phantomVerifiedUserAddresses.txt");
        try {
          await fs.access(dirPath);
        } catch (error) {
          await fs.mkdir(dirPath, { recursive: true });
        }
        // If the NFT is verified, write the user's address to the file.
        await fs.appendFile(filePath, `\n${userAddress}`);
        console.log("The address was appended to the file!");

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

export { handleNFTVerification };
