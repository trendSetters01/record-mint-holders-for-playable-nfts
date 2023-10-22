import { setuserNFTChoice } from "../../state/index.js";
import { handleNFTVerification } from "../../utils/handleNFTVerification.js";

async function handleVerifynft(interaction) {
  const userId = interaction.user.id;
  const userChoice = interaction.options.getString("choice");

  setuserNFTChoice(userId, userChoice);

  const { verifynftEmbed, isValid } = await handleNFTVerification(
    interaction,
    userChoice
  );

  if (isValid) {
    try {
      await interaction.member.roles.add("1145372070553845770");
    } catch (error) {
      console.log("attempted role add failed", error);
    }
  }

  await interaction.reply({ embeds: [verifynftEmbed] });
}

export { handleVerifynft };
