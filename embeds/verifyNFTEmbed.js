import { EmbedBuilder } from "discord.js";

function createVerifyV2NFTSuccessEmbed(address) {
  return new EmbedBuilder()
    .setColor(5763719) // This color represents a shade of green;
    .setTitle("NFT verified Successfully")
    .setDescription(
      `Congratulations! Your Phantom NFT has been successfully verified\n\nYou're now eligible to claim exclusive rewards! To proceed, please use the following command:\n\`/chooserewardwallet\`\n\nThis will initiate the process for you to setting up your reward wallet for your Byte city playable NFT. Thank you for your participation!`
    );
}

function createVerifyV1NFTSuccessEmbed(address) {
  return new EmbedBuilder()
    .setColor(5763719) // Green color
    .setTitle("NFT Verification Successful")
    .setDescription(
      `Congratulations! Your account has met the verification criteria.\n\n` +
        `Your Algorand address \`${address}\` has been successfully verified as owning a Phantom Pals NFT or holding more than 3500 PHNTM tokens (AssetID: 1279721720).\n\n` +
        `Welcome to the verified club!`
    );
}

function createVerifyNFTFailureEmbed(reason) {
  return new EmbedBuilder()
    .setColor(16711680) // Red color
    .setTitle("NFT Verification Failed")
    .setDescription(
      `Unfortunately, we encountered an issue while processing your request.` +
        `${reason ? `\n\nReason: ${reason}` : ""}` +
        `\n\nFor verification, your address must own either a Phantom Pals NFT or more than 3500 PHNTM tokens (AssetID: 1279721720).\n\n` +
        `Please check your holdings and try again, or reach out for assistance in the questions channel if you need help.`
    );
}

export {
  createVerifyV2NFTSuccessEmbed,
  createVerifyV1NFTSuccessEmbed,
  createVerifyNFTFailureEmbed,
};
