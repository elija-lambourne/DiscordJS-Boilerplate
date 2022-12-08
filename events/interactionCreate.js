const Discord = require("discord.js");
const cooldowns = new Map();
const {QuickDB} = require("quick.db");
const db = new QuickDB({filePath: "../../databases/database.sqlite"});
const accounts = new db.table("accounts");

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    const client = interaction.client;

    const underMaintenance = new Discord.MessageEmbed()
      .setDescription(":hammer: This command is currently under maintenance")
      .setColor("4169e1");

    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) return;
    accounts.delete(`${interaction.member.id}`);
    if (interaction.commandName === "start") {
      const account = accounts.get(`${interaction.member.id}`); //Make efficient
      if (account && account.status === "in progress") {
        return interaction.reply({
          content: "Please stop the current setup first.",
          ephemeral: true,
        });
      }
    }

    //Maintenance
    const notAvailable = command.maintenance;
    if (notAvailable === true && interaction.member.id !== "448486685999628319") {
      return interaction.reply({ embeds: [underMaintenance], ephemeral: true });
    }

    //Permissions
    const validPermissions = [
      "CREATE_INSTANT_INVITE",
      "KICK_MEMBERS",
      "BAN_MEMBERS",
      "ADMINISTRATOR",
      "MANAGE_CHANNELS",
      "MANAGE_GUILD",
      "ADD_REACTIONS",
      "VIEW_AUDIT_LOG",
      "PRIORITY_SPEAKER",
      "STREAM",
      "VIEW_CHANNEL",
      "SEND_MESSAGES",
      "SEND_TTS_MESSAGES",
      "MANAGE_MESSAGES",
      "EMBED_LINKS",
      "ATTACH_FILES",
      "READ_MESSAGE_HISTORY",
      "MENTION_EVERYONE",
      "USE_EXTERNAL_EMOJIS",
      "VIEW_GUILD_INSIGHTS",
      "CONNECT",
      "SPEAK",
      "MUTE_MEMBERS",
      "DEAFEN_MEMBERS",
      "MOVE_MEMBERS",
      "USE_VAD",
      "CHANGE_NICKNAME",
      "MANAGE_NICKNAMES",
      "MANAGE_ROLES",
      "MANAGE_WEBHOOKS",
      "MANAGE_EMOJIS",
    ];

    if (command.permissions.length) {
      let invalidPerms = [];
      for (const perm of command.permissions) {
        if (!validPermissions.includes(perm)) {
          return console.log("Invalid Permission");
        }
        if (!interaction.member.permissions.has(perm)) {
          invalidPerms.push(perm);
          break;
        }
      }
      if (invalidPerms.length) {
        return interaction.reply({
          content: `Missing permissions: \`${invalidPerms}\``,
          ephemeral: true,
        });
      }
    }

    //Cooldown
    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Discord.Collection());
    }

    const currentTime = Date.now();
    const timeStamp = cooldowns.get(command.name);
    const cooldown = command.cooldown * 1000;

    if (timeStamp.has(interaction.member.id)) {
      const expiration = timeStamp.get(interaction.member.id) + cooldown;

      if (currentTime < expiration) {
        const timeLeft = (expiration - currentTime) / 1000;

        return interaction.reply({
          content: `Please wait another ${timeLeft.toFixed(
            1
          )} seconds before using the command again`,
          ephemeral: true,
        });
      }
    }

    timeStamp.set(interaction.member.id, currentTime);
    setTimeout(() => timeStamp.delete(interaction.member.id), cooldown);

    //Execution
    try {
      await command.execute(interaction,client,Discord);
    } catch (err) {
      console.log(err);
    }
  },
};
