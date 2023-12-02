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

        queue.setPaused(false);

        await interaction.reply(`Resuming **${currentSong.title}**`);
    },

    data: new SlashCommandBuilder()
        .setName('resume')
        .setDescription('Resumes the current song.')
}
*/