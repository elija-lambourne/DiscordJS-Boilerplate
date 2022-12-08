const {
    SlashCommandBuilder
} = require('@discordjs/builders');

module.exports = {
    name: 'ping',
    aliases: ['p'],
    permissions: '',
    maintenance: false,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('returns bot latency'),
    execute(interaction, client, Discord, message, args) {
        interaction.reply(`🏓pong! Latency: ${interaction.createdTimestamp - Date.now()}ms`)
        setTimeout(() => interaction.deleteReply().catch(() => { }), 20000)

    },
};