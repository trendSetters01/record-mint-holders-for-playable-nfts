async function handleInvite(interaction) {
  const inviteLink = 'https://discord.com/api/oauth2/authorize?client_id=1164834110058025000&permissions=17877801569345&scope=bot%20applications.commands';
  await interaction.reply(`Click [here](${inviteLink}) to invite the bot to your server!`);
}

export { handleInvite };
