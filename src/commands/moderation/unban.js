const { Client, Interaction, ApplicationCommandOptionType, PermissionFlagsBits, } = require('discord.js');
  
  module.exports = {
    /**
     *
     * @param {Client} client
     * @param {Interaction} interaction
     */
  
    callback: async (client, interaction) => {
      const targetUserId = interaction.options.getUser('target-user');
      const reason =
        interaction.options.get('reason')?.value || 'No reason provided';
  
      await interaction.deferReply();

      // Ban the targetUser
      try {
        await interaction.guild.bans.fetch().then(async bans => {
            if(bans.size === 0) 
                return await interaction.editReply({content: 'There is no one banned from this server', ephemeral: true});
            let bannedID = bans.find(ban => ban.user.id === targetUserId);
            if(!bannedID) 
                return await interaction.editReply({content: 'This ID is not banned from this server', ephemeral: true});
            
            await interaction.guild.bans.remove(targetUserId, reason).catch(error => {
                return interaction.editReply({ content: 'I cannot unban this user'});
            })
        })

        await interaction.editReply(
          `User ${targetUserId} was unbanned\nReason: ${reason}`
        );
      } catch (error) {
        console.log(`There was an error when banning: ${error}`);
      }
    },
  
    name: 'unban',
    description: 'Unbans a member from this server.',
    options: [
      {
        name: 'target-user',
        description: 'The user you want to unban.',
        type: ApplicationCommandOptionType.Mentionable,
        required: true,
      },
      {
        name: 'reason',
        description: 'The reason for unbanning.',
        type: ApplicationCommandOptionType.String,
      },
    ],
    permissionsRequired: [PermissionFlagsBits.BanMembers],
    botPermissions: [PermissionFlagsBits.BanMembers],
  };