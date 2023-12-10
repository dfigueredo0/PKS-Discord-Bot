const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  AttachmentBuilder,
} = require("discord.js");
const canvacord = require("canvacord");
const calculateLevelXP = require("../../utils/calculateLevelXP");
const Level = require("../../schemas/Level");

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

    await interaction.deferReply();

    const mentionedUserID = interaction.options.get("target-user")?.value;
    const targetUserID = mentionedUserID || interaction.member.id;
    const targetUserObj = await interaction.guild.members.fetch(targetUserID);

    const fetchedLevel = await Level.findOne({
      userID: targetUserID,
      guildID: interaction.guild.id,
    });

    if (!fetchedLevel) {
      interaction.editReply(
        mentionedUserID
          ? `${targetUserObj.user.tag} doesn't have a level yet.`
          : "You don't have any levels yet."
      );
      return;
    }

    let allLevels = await Level.find({ guildID: interaction.guild.id }).select(
      "-_id userID level xp"
    );

    allLevels.sort((a, b) => {
      if (a.level === b.level) return (b.xp = a.xp);
      else return b.level - a.level;
    });

    let currentRank =
      allLevels.findIndex((lvl) => lvl.userID === targetUserID) + 1;

    const rank = new canvacord.Rank()
      .setAvatar(targetUserObj.user.displayAvatarURL({ size: 256 }))
      .setRank(currentRank)
      .setLevel(fetchedLevel.level)
      .setCurrentXP(fetchedLevel.xp)
      .setRequiredXP(calculateLevelXP(fetchedLevel.level))
      .setStatus(targetUserObj.presence.status)
      .setProgressBar("#FFC300", "COLOR")
      .setUsername(targetUserObj.user.displayName)
      .setDiscriminator(targetUserObj.user.discriminator);

    const data = await rank.build();
    const attachment = new AttachmentBuilder(data);

    interaction.editReply({ files: [attachment] });
  },

  name: "level",
  description: "Shows your or someone's level.",
  options: [
    {
      name: "target-user",
      description: "The user whose level you want to see.",
      type: ApplicationCommandOptionType.Mentionable,
    },
  ],
};
