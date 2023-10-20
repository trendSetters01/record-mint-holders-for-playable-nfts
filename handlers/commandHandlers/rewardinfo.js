import { createRewardInfoEmbed } from "../../embeds/index.js";

async function handleRewardinfo(interaction) {
  const rewardInfoEmbed = createRewardInfoEmbed();
  await interaction.reply({ embeds: [rewardInfoEmbed] });
}

export { handleRewardinfo };
