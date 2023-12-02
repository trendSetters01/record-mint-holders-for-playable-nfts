import { verifyNFT } from "../algorand/verifyNFT.js";
import { getAddress } from "../db/utils/getAddress.js";

import fs from "fs/promises";
import path from "path";

import {
  createVerifyV1NFTSuccessEmbed,
  createVerifyV2NFTSuccessEmbed,
  createVerifyNFTFailureEmbed,
  sendSetAddressReminderForNFTVerificationEmbed,
} from "../embeds/index.js";

import { addVerifiedUserAddress } from "./addVerifiedUserAddress.js";

async function handleNFTVerification(interaction, userChoice) {
  let userAddress = await getAddress(interaction, "algorandAddress");

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

export { handleNFTVerification };
