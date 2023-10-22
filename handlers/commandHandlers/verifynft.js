import { setuserNFTChoice } from "../../state/index.js";
import { handleNFTVerification } from "../../utils/handleNFTVerification.js";

const PHANTOM_ROLE = process.env["PHANTOM_ROLE"];

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
      await interaction.member.roles.add(PHANTOM_ROLE);
    } catch (error) {
      console.log("attempted role add failed", error);
    }
  }

  await interaction.reply({ embeds: [verifynftEmbed] });
}

export { handleVerifynft };
