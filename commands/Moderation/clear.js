const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
    name: "clear",
    description: "<prefix>clear <amount>",
    permissions: ["MANAGE_MESSAGES", "ADMINISTRATOR"],
    cooldown: 3,
    maintenance: false,
    data: new SlashCommandBuilder()
        .setName("clear")
        .setDescription("clears messages (max. 14 days old)")
        .addNumberOption((option) =>
            option
                .setName("amount")
                .setDescription("amount of messages to be cleared")
                .setRequired(true)
        ),
    async execute(interaction, client, Discord, message, args) {
        const amount = interaction.options.getNumber("amount");

        if (amount > 100)
            return interaction.reply("Exceeding the max amount (100)");
        if (amount < 1)
            interaction.reply({
                content: "Cannot clear less then one message",
                ephemeral: true,
            }); //than / then

        await interaction.channel.messages
            .fetch({ limit: amount })
            .then((messages) => {
                interaction.channel.bulkDelete(messages, true).catch(() => {
                    return interaction.reply({
                        content: "An error occurred",
                        ephemeral: true,
                    }); //Get error code in data bank
                });
            });
        interaction.reply(`Deleted ${amount} messages`); //Make message say actual messages
        setTimeout(() => interaction.deleteReply().catch(() => { }), 10000);
    },
};
