import { createHowItWorksEmbed } from "../../embeds/index.js";

async function handleHowitworks(interaction) {
  const howItWorksEmbed = createHowItWorksEmbed();
  await interaction.reply({ embeds: [howItWorksEmbed] });
}

export { handleHowitworks };
