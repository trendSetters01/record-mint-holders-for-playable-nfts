import { Client, IntentsBitField } from "discord.js";
import { handleInteraction } from "./handlers/index.js";
import { User, AddressSet } from "./db/models/index.js";

import "dotenv/config";

const token = process.env["BOT_TOKEN"];

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", (c) => {
  User.sync({ force: true })
    .then(() => console.log("User table created or successfully verified"))
    .catch(console.error);

  AddressSet.sync({ force: true })
    .then(() =>
      console.log("AddressSet table created or successfully verified")
    )
    .catch(console.error);
  console.log(`${c.user.tag} is online`);
});

client.on("interactionCreate", handleInteraction);

client.login(token);
