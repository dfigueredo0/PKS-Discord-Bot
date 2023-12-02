const { Client, Interaction, ApplicationCommandOptionType } = require('discord.js');
const User = require('../../schemas/User')

module.exports = {
     /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
     callback: async (client, interaction) => {
        if(!interaction.inGuild()) {
            interaction.reply({
                content: 'You can only run this command inside a server.',
                ephemeral: true,
            });
            return;
        }

        const targetUserID = interaction.options.get('target-user')?.value || interaction.member.id; 

        await interaction.deferReply();

        const user = await User.findOne({ userID: targetUserID, guildID: interaction.guild.id });

        if(!user) {
            interaction.editReply(
                `<@${targetUserID}> doesn't have a profile yet.`
            );
            return;
        }

        interaction.editReply(
            targetUserID === interaction.member.id
                ? `Your balance is $**${user.balance}**`
                : `<@${targetUserID}>'s is $**${user.balance}**`
        );
    },

    name: 'balance',
    description: 'See your or someone else\'s balance',
    option: [
        {
            name: 'target-user',
            description: 'The user whose balance you want to get',
            type: ApplicationCommandOptionType.User,
        }
    ]
};