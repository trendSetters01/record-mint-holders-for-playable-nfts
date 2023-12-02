import { EmbedBuilder } from "discord.js";

function invalidRequestEmbed(reason) {
  return new EmbedBuilder().setColor(16711680).setTitle("Invalid Request");
}

export { invalidRequestEmbed };
