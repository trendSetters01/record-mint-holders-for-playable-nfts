import { Client, IntentsBitField } from "discord.js";
import { handleInteraction } from "./handlers/index.js";
import {
  User,
  UserRole,
  AddressSet,
  StakingSet,
  StakingAssets,
  RoleBoost,
  RoleType,
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

  // UserRole.sync({ force: true })
  //   .then(() => console.log("User Role table created or successfully verified"))
  //   .catch(console.error);

  AddressSet.sync()
    .then(() =>
      console.log("AddressSet table created or successfully verified")
    )
    .catch(console.error);
  // RoleBoost.sync({ force: true })
  //   .then(() => console.log("RoleBoost table created or successfully verified"))
  //   .catch(console.error);

  // RoleType.sync({ force: true })
  //   .then(() => console.log("RoleType table created or successfully verified"))
  //   .catch(console.error);

  // StakingSet.sync({ force: true })
  //   .then(() =>
  //     console.log("StakingSet table created or successfully verified")
  //   )
  //   .catch(console.error);

  // StakingAssets.sync({ force: true })
  //   .then(() =>
  //     console.log("StakingAssets table created or successfully verified")
  //   )
  //   .catch(console.error);

  console.log(`${c.user.tag} is online`);
});

client.on("interactionCreate", handleInteraction);

client.login(token);
