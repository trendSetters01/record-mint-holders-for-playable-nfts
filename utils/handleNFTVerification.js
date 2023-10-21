import { verifyNFT } from "../algorand/accountManagement.js";
import { getUserAddress, getuserNFTAssetID } from "../state/index.js";
import {
  createVerifyV1NFTSuccessEmbed,
  createVerifyV2NFTSuccessEmbed,
  createVerifyNFTFailureEmbed,
  sendSetAddressReminderForNFTVerificationEmbed,
} from "../embeds/index.js";

async function handleNFTVerification(interaction, userChoice) {
  const userAddress = getUserAddress(interaction.user.id);
  const userNFTAssetID = getuserNFTAssetID(interaction.user.id);

  if (userAddress) {
    try {
      const isValid = await verifyNFT(userAddress, userNFTAssetID);

      if (isValid) {
        return userChoice === "versionOne"
          ? createVerifyV1NFTSuccessEmbed()
          : createVerifyV2NFTSuccessEmbed();
      } else {
        return createVerifyNFTFailureEmbed();
      }
    } catch (error) {
      console.error("Error sending Algo:", error);
      return createVerifyNFTFailureEmbed(error.message  || "An unexpected error occurred.");
    }
  } else {
    return sendSetAddressReminderForNFTVerificationEmbed();
  }
}

export { handleNFTVerification };
