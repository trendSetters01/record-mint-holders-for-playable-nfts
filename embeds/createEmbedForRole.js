import { EmbedBuilder } from "discord.js";

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

  export { createEmbedForRole };