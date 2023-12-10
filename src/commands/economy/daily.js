const { Client, Interaction, EmbedBuilder } = require("discord.js");
const User = require("../../schemas/User");

const allowanceAmount = 500;

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply({
        content: "You can only run this command inside a server.",
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
            "You have already collected you allowance today. Come back tomorrow."
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

      user.streak =
        Date.now() - user.lastDaily.getDate() < 2 * dayInMillis
          ? user.streak + 1
          : 0;
      await user.save();
      if (user.streak === 0) {
        user.balance += allowanceAmount;
        interaction.editReply(
          {
            embeds: [
              new EmbedBuilder()
                .setAuthor({
                  name: interaction.member.displayName,
                  iconURL: memberAvatarURL,
                })
                .setTitle("Daily Claimed")
                .setDescription(`+ $${user.balance}`)
                .addFields([
                  {
                    name: "Streak",
                    value: ":o: :o: :o: :o: :o:",
                    inline: true,
                  },
                ]),
            ],
          }
          //`$${allowanceAmount} was added to your balance. Your new balance is $${user.balance}`
        );
      } else if (user.streak === 1) {
        allowanceAmount = allowanceAmount * 1.2;
        user.balance += allowanceAmount;
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: interaction.member.displayName,
                iconURL: memberAvatarURL,
              })
              .setTitle("Daily Claimed")
              .setDescription(`+ $${user.balance}`)
              .addFields([
                {
                  name: "Streak",
                  value: ":red_circle: :o: :o: :o: :o:",
                  inline: true,
                },
              ]),
          ],
        });
      } else if (user.streak === 2) {
        allowanceAmount = allowanceAmount * 1.4;
        user.balance += allowanceAmount;
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: interaction.member.displayName,
                iconURL: memberAvatarURL,
              })
              .setTitle("Daily Claimed")
              .setDescription(`+ $${user.balance}`)
              .addFields([
                {
                  name: "Streak",
                  value: ":red_circle: :o: :o: :o: :o:",
                  inline: true,
                },
              ]),
          ],
        });
      } else if (user.streak === 3) {
        allowanceAmount = allowanceAmount * 1.6;
        user.balance += allowanceAmount;
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: interaction.member.displayName,
                iconURL: memberAvatarURL,
              })
              .setTitle("Daily Claimed")
              .setDescription(`+ $${user.balance}`)
              .addFields([
                {
                  name: "Streak",
                  value: ":red_circle: :red_circle: :red_circle: :o: :o:",
                  inline: true,
                },
              ]),
          ],
        });
      } else if (user.streak === 4) {
        allowanceAmount = allowanceAmount * 1.8;
        user.balance += allowanceAmount;
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: interaction.member.displayName,
                iconURL: memberAvatarURL,
              })
              .setTitle("Daily Claimed")
              .setDescription(`+ $${user.balance}`)
              .addFields([
                {
                  name: "Streak",
                  value:
                    ":red_circle: :red_circle: :red_circle: :red_circle: :o:",
                  inline: true,
                },
              ]),
          ],
        });
      } else {
        allowanceAmount = allowanceAmount * 2;
        user.balance += allowanceAmount;
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: interaction.member.displayName,
                iconURL: memberAvatarURL,
              })
              .setTitle("Daily Claimed")
              .setDescription(`+ $${user.balance}`)
              .addFields([
                {
                  name: "Streak",
                  value:
                    ":red_circle: :red_circle: :red_circle: :red_circle: :red_circle:",
                  inline: true,
                },
              ]),
          ],
        });
      }
    } catch (error) {
      console.log(`${error}`);
    }
  },

  name: "daily",
  description: "Calim your daily reward.",
};
