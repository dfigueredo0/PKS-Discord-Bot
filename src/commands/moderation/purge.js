const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits } = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        const amount = interaction.options.getNumber('amount');

        await interaction.deferReply();
        
        if(amount > 100) {
            interaction.editReply(
                `${amount} is above the allowed maximum`,
            );
            return;
        }

        await interaction.editReply({
            content: `Started deleting ${amount} message(s).`,
            ephemeral: true,
        });

        const messages = await interaction.channel.bulkDelete(amount, true);

        await interaction.editReply(`Successfully deleted ${messages.size} message(s).`).catch((e) => {
            console.log(`${e}`);
        })
    },

    name: 'purge',
    description: 'This purges channel messages',
    options: [
        {
            name: 'amount',
            description: 'The amount of messages to delete.',
            type: ApplicationCommandOptionType.Number,
            required: true
        }
    ],
    permissionsRequired: [PermissionFlagsBits.ManageMessages],
    botPermissions: [PermissionFlagsBits.ManageMessages],
};