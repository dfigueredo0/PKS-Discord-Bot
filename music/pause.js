/*
const { SlashCommandBuilder } = require('@discordjs/builders');
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

        queue.setPaused(true);

        await interaction.reply(`Paused **${currentSong.title}**`);
    },

    data: new SlashCommandBuilder()
        .setName('pause')
        .setDescription('Pauses the current song.')
}
*/