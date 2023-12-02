/*const { SlashCommandBuilder } = require('@discordjs/builders');
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

        const currentSong = queue.current;

        queue.skip();

        await interaction.reply({
            embeds: [
                new MessageEmbed()
                    .setDescription(`Skipped **${currentSong.title}**`)
                    .setThumbnail(currentSong.thumbnail)
            ]
        })
    },

    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Skips the current song.')
*/