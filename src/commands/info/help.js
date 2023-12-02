const { Client, Interaction, } = require('discord.js');
const getLocalCommands = require('../../utils/getLocalCommands');

module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
  
    callback: async (client, interaction) => { 
        let str = '';
        const localCommands = getLocalCommands();

        for (const localCommand of localCommands) {
            const { name, description } = localCommand;

            str += `Name: ${name}, Descpription: ${description}\n`
        }

        interaction.reply({
            content: str,
            ephmeral: true,
        })
    },

    name: 'help',
    description: 'List all available commands.'
}