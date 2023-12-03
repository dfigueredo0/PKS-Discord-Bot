const { Client, Interaction } = require('discord.js');

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
  
    callback: async (client, interaction) => { 
         interaction.reply('https://github.com/dfigueredo0/PKS-Discord-Bot');
    },

    name: 'github',
    description: 'Gives github link for Caroll K Simmons Bot.'
}