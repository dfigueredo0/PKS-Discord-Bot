const { Client, Interaction, EmbedBuilder } = require('discord.js');
const User = require('../../schemas/User');

const dailyAmount = 500;

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: 'You can only run this command inside a server.',
        ephemeral: true,
      });
      return;
    }

    try {
      await interaction.deferReply();

      const query = {
        userID: interaction.member.id,
        guildID: interaction.guild.id,
      };

      let user = await User.findOne(query);

      const memberAvatarURL =
        interaction.member.avatarURL() ?? interaction.member.user.avatarURL();

      const dayInMillis = 24 * 60 * 60 * 1000;

      if (user) {
        const lastDailyDate = user.lastDaily.toDateString();
        const currentDate = new Date().toDateString();

        if (lastDailyDate === currentDate) {
          interaction.editReply(
            'You have already collected you allowance today. Come back tomorrow.'
          );
          return;
        }

        user.lastDaily = new Date();
      } else {
        user = new User({
          ...query,
          lastDaily: new Date(),
        });
      }

      if (user.streak === 0) {
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: interaction.member.displayName,
                iconURL: memberAvatarURL,
              })
              .setTitle('Daily Claimed')
              .setDescription(`+ $${dailyAmount}`)
              .addFields([
                {
                  name: 'Streak',
                  value: ':o: :o: :o: :o: :o:',
                  inline: true,
                },
              ]),
          ],
        });
      } else if (user.streak === 1) {
        dailyAmount = dailyAmount * 1.2;

        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: interaction.member.displayName,
                iconURL: memberAvatarURL,
              })
              .setTitle('Daily Claimed')
              .setDescription(`+ $${dailyAmount}`)
              .addFields([
                {
                  name: 'Streak',
                  value: '<a:Streak:1183431077071683664> :o: :o: :o: :o:',
                  inline: true,
                },
              ]),
          ],
        });
      } else if (user.streak === 2) {
        dailyAmount = dailyAmount * 1.4;

        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: interaction.member.displayName,
                iconURL: memberAvatarURL,
              })
              .setTitle('Daily Claimed')
              .setDescription(`+ $${dailyAmount}`)
              .addFields([
                {
                  name: 'Streak',
                  value: '<a:Streak:1183431077071683664> :o: :o: :o: :o:',
                  inline: true,
                },
              ]),
          ],
        });
      } else if (user.streak === 3) {
        dailyAmount = dailyAmount * 1.6;

        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: interaction.member.displayName,
                iconURL: memberAvatarURL,
              })
              .setTitle('Daily Claimed')
              .setDescription(`+ $${dailyAmount}`)
              .addFields([
                {
                  name: 'Streak',
                  value:
                    '<a:Streak:1183431077071683664> <a:Streak:1183431077071683664> <a:Streak:1183431077071683664> :o: :o:',
                  inline: true,
                },
              ]),
          ],
        });
      } else if (user.streak === 4) {
        dailyAmount = dailyAmount * 1.8;

        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: interaction.member.displayName,
                iconURL: memberAvatarURL,
              })
              .setTitle('Daily Claimed')
              .setDescription(`+ $${dailyAmount}`)
              .addFields([
                {
                  name: 'Streak',
                  value:
                    '<a:Streak:1183431077071683664> <a:Streak:1183431077071683664> <a:Streak:1183431077071683664> <a:Streak:1183431077071683664> :o:',
                  inline: true,
                },
              ]),
          ],
        });
      } else {
        dailyAmount = dailyAmount * 2;

        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: interaction.member.displayName,
                iconURL: memberAvatarURL,
              })
              .setTitle('Daily Claimed')
              .setDescription(`+ $${dailyAmount}`)
              .addFields([
                {
                  name: 'Streak',
                  value:
                    '<a:Streak:1183431077071683664> <a:Streak:1183431077071683664> <a:Streak:1183431077071683664> <a:Streak:1183431077071683664> <a:Streak:1183431077071683664>',
                  inline: true,
                },
              ]),
          ],
        });
      }

      user.balance += dailyAmount;
      user.streak =
        Date.now() - user.lastDaily.getDate() < 2 * dayInMillis
          ? user.streak + 1
          : 1;
      await user.save();
    } catch (error) {
      console.log(`${error}`);
    }
  },

  name: 'daily',
  description: 'Calim your daily reward.',
};
