/* const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, Client, Interaction } = require('discord.js');

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     *
    callback: async (client, interaction) => {
        const queue = client.player.getQueue(interaction.guild);

        if (!queue) {
            await interaction.reply('There is no song playing.');
            return;
        }

        queue.destroy();

        await interaction.reply(`${interaction.guild.members.me.displayName} has left.`);
    },

    data: new SlashCommandBuilder()
        .setName('exit')
        .setDescription('Exits the Voice channel.')
}
*/