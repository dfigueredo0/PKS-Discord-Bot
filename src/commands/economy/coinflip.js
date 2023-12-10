const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  EmbedBuilder,
} = require('discord.js');
const User = require('../../schemas/User');

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

    const choice = interaction.options.get('choice').value;
    const amount = interaction.options.getNumber('amount');

    const memberAvatarURL =
      interaction.member.avatarURL() ?? interaction.member.user.avatarURL();
    const didWin = Math.random() > 0.5;

    await interaction.deferReply();

    let user = await User.findOne({
      userID: interaction.member.id,
      guildID: interaction.guild.id,
    });

    if (!user) {
      user = new User({
        userID: interaction.member.id,
        guildID: interaction.guild.id,
      });
    }

    if (amount > user.balance) {
      interaction.editReply(`You don't have enough to gamble $${amount}`);
      return;
    }

    interaction.editReply(
      `<a:Coin:1183431092456394752> | The coin flips into the air...`
    );

    if (!didWin && choice === 'Tails') {
      user.balance -= amount;
      await user.save();

      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: interaction.member.displayName,
              iconURL: memberAvatarURL,
            })
            .setTitle(`Heads!`)
            .setDescription(
              'Sorry, The coin landed on heads.\nBut remember, 90% of Gamblers quit before they hit it big'
            )
            .setFooter({
              text: `You lost $${amount}.`,
            })
            .setColor('Gold'),
        ],
      });
      return;
    } else if (!didWin && choice === 'Heads') {
      user.balance -= amount;
      await user.save();

      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: interaction.member.displayName,
              iconURL: memberAvatarURL,
            })
            .setTitle(`Tails!`)
            .setDescription(
              'Sorry, The coin landed on tails.\nBut remember, 90% of Gamblers Quit Before They Hit It Big'
            )
            .setFooter({ text: `You lost $${amount}.` })
            .setColor('Gold'),
        ],
      });
    } else {
      const amountWon = Number((amount * (Math.random() + 0.55)).toFixed(0));

      user.balance += amountWon;
      await user.save();

      interaction.editReply({
        embeds: [
          new EmbedBuilder()
            .setAuthor({
              name: interaction.member.displayName,
              iconURL: memberAvatarURL,
            })
            .setTitle(`${choice}!`)
            .setDescription(`Congratulations, the coin landed on ${choice}.`)
            .setFooter({
              text: `You won $${amountWon}.`,
            })
            .setColor('Gold'),
        ],
      });
    }
  },

  name: 'coinflip',
  description: 'Gamble your balance in a 50/50 chance.',
  options: [
    {
      name: 'choice',
      description: 'The side you think the coin will land on.',
      type: ApplicationCommandOptionType.String,
      required: true,
      choices: [
        {
          name: 'Heads',
          value: 'Heads',
        },
        {
          name: 'Tails',
          value: 'Tails',
        },
      ],
    },
    {
      name: 'amount',
      description: 'The amount you want to gamble.',
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
};
