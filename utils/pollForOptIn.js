import { EmbedBuilder } from "discord.js";

import { checkOptIn } from "../algorand/assignRole/checkOptin.js";

async function replyOptInFailed(interaction) {
  await interaction.followUp({
    embeds: [
      new EmbedBuilder()
        .setColor(16711680)
        .setTitle("Opt-in not detected")
        .setDescription("Please try opting in again."),
    ],
  });
}

// needs to be adjusted for different edge cases
// 1. user opts in but my app restarts before I can send the asset so the timer for the poll gets reset
async function pollForOptIn(address, assetId, interval, duration, interaction) {
  const endTime = Date.now() + duration;

  return new Promise((resolve, reject) => {
    const check = async () => {
      try {
        if (await checkOptIn(address, assetId)) {
          console.log("User has opted in!");
          resolve(true);
        } else if (Date.now() < endTime) {
          setTimeout(check, interval);
        } else {
          console.log("Polling time expired. User did not opt in.");
          resolve(false);
          await replyOptInFailed(interaction);
        }
      } catch (error) {
        reject(error);
      }
    };

    check();
  });
}

export { pollForOptIn };