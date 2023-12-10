const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  EmbedBuilder,
} = require("discord.js");
const User = require("../../schemas/User");

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

      const targetUserID =
        interaction.options.get("target-user")?.value || interaction.member.id;

      const user = await User.findOne({
        userID: targetUserID,
        guildID: interaction.guild.id,
      });

      const memberAvatarURL =
        interaction.member.avatarURL() ?? interaction.member.user.avatarURL();

      if (!user) {
        interaction.editReply(`<@${targetUserID}> doesn't have a profile yet.`);
        return;
      }

      if (targetUserID === interaction.member.id && user.balance != null) {
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: interaction.member.displayName,
                iconURL: memberAvatarURL,
              })
              .setTitle("Balance")
              .setDescription(`Your balance is $${user.balance}`),
          ],
        });
      } else {
        interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: interaction.member.displayName,
                iconURL: memberAvatarURL,
              })
              .setTitle("Balance")
              .setDescription(
                `<@${targetUserID}>'s balance is $**${user.balance}**`
              ),
          ],
        });
      }
    } catch (error) {
      console.log(`${error}`);
    }
  },

  name: "balance",
  description: "Shows your balance or check the balanace of someone else.",
  options: [
    {
      name: "target-user",
      description: "The user you want to check the balance of.",
      type: ApplicationCommandOptionType.User,
    },
  ],
};
