const fs = require("fs");

const Discord = require("discord.js");
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildVoiceStates,
    Discord.GatewayIntentBits.GuildPresences,
    Discord.GatewayIntentBits.GuildMessageTyping,
    Discord.GatewayIntentBits.GuildMessageReactions,
  ],
});

require("dotenv").config();

client.commands = new Discord.Collection();

const eventFiles = fs
  .readdirSync("./events")
  .filter((file) =>  file.endsWith(".js"));
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
