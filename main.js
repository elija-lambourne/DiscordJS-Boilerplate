import fs from "fs";

const Discord = require("discord.js");
const client = new Discord.Client({
  intents: [
    Discord.Intents.FLAGS.GUILDS,
    Discord.Intents.FLAGS.GUILD_MESSAGES,
    Discord.Intents.FLAGS.GUILD_MEMBERS,
    Discord.Intents.FLAGS.GUILD_VOICE_STATES,
    Discord.Intents.FLAGS.GUILD_PRESENCES,
    Discord.Intents.FLAGS.GUILD_MESSAGE_TYPING,
    Discord.Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
  ],
});

require("dotenv").config();

client.commands = new Discord.Collection();

const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));
const commandFolders = fs.readdirSync("./commands");
const handlers = fs
  .readdirSync("./handlers")
  .filter((file) => file.endsWith(".js"));

(async () => {
  for (let file of handlers) {
    require(`./handlers/${file}`)(client);
  }

  client.handleEvents(eventFiles, "./events");
  client.handleCommands(commandFolders, "./commands");

  await client.login(process.env.TOKEN);
})();
