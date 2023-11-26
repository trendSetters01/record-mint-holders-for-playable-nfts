import { Client, IntentsBitField } from "discord.js";
import { handleInteraction } from "./handlers/index.js";
import {
  User,
  AddressSet,
  StakingSet,
  StakingAssets,
} from "./db/models/index.js";

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
  User.sync()
    .then(() => console.log("User table created or successfully verified"))
    .catch(console.error);

  AddressSet.sync()
    .then(() =>
      console.log("AddressSet table created or successfully verified")
    )
    .catch(console.error);

  // StakingSet.sync()
  //   .then(() =>
  //     console.log("StakingSet table created or successfully verified")
  //   )
  //   .catch(console.error);
  // StakingAssets.sync()
  //   .then(() =>
  //     console.log("StakingAssets table created or successfully verified")
  //   )
  //   .catch(console.error);
  console.log(`${c.user.tag} is online`);
});

client.on("interactionCreate", handleInteraction);

client.login(token);
