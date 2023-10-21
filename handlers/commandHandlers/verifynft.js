import { setuserNFTChoice, setuserNFTAssetID } from "../../state/index.js";
import { handleNFTVerification } from "../../utils/handleNFTVerification.js";

async function handleVerifynft(interaction) {
  const userId = interaction.user.id;
  const userChoice = interaction.options.getString("choice");
  const userNFTAssetID = interaction.options.getString("assetid");

  setuserNFTChoice(userId, userChoice);
  setuserNFTAssetID(userId, userNFTAssetID);
  
  const verifynftEmbed = await handleNFTVerification(interaction, userChoice);
  await interaction.reply({ embeds: [verifynftEmbed] });
}

export { handleVerifynft };
