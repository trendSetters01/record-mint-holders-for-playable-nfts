import { verifyNFT } from "../algorand/verifyNFT.js";
import { getUserAddress } from "../state/index.js";
import {
  createVerifyV1NFTSuccessEmbed,
  createVerifyV2NFTSuccessEmbed,
  createVerifyNFTFailureEmbed,
  sendSetAddressReminderForNFTVerificationEmbed,
} from "../embeds/index.js";

async function handleNFTVerification(interaction, userChoice) {
  const userAddress = getUserAddress(interaction.user.id);

  if (userAddress) {
    try {
      const isValid = await verifyNFT(userAddress);

      if (isValid) {
        return userChoice === "versionOne"
          ? { verifynftEmbed: createVerifyV1NFTSuccessEmbed(), isValid }
          : { verifynftEmbed: createVerifyV2NFTSuccessEmbed(), isValid };
      } else {
        return {
          verifynftEmbed: createVerifyNFTFailureEmbed(),
          isValid
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
      verifynftEmbed: await sendSetAddressReminderForNFTVerificationEmbed(),
      isValid: false,
    };
  }
}

export { handleNFTVerification };
