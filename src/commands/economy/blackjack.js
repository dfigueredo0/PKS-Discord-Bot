const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require("discord.js");
const User = require("../../schemas/User");

const suits = ["Hearts", "Diamonds", "Clubs", "Spades"];
const ranks = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
];

function createDeck() {
  const deck = [];
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push(`${rank} of ${suit}`);
    }
  }
  return deck;
}

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}
const choices = [
  { name: "Hit", emoji: "" },
  { name: "Stay", emoji: "" },
];

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
      const amount = interaction.options.getNumber("amount");

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
        interaction.reply(`You don't have enough to gamble $${amount}`);
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle("BlackJack")
        .addFields([
          {
            name: `Your Cards ()`,
            value: ``,
          },
          {
            name: `Dealer's Cards ()`,
            value: ``,
          },
        ])
        .setFooter("Hit or Stay");

      const buttons = choices.map((choice) => {
        return new ButtonBuilder.setCustomId(choice.name)
          .setLabel(choice.name)
          .setStyle(ButtonStyle.Primary);
      });

      const row = new ActionRowBuilder().addComponents(buttons);

      const reply = await interaction.reply({
        embeds: [embed],
        components: [row],
      });

      const userInteraction = await reply
        .awaitMessageComponent({
          filter: (i) => i.user.id === interaction.user.id,
          time: 5_000,
        })
        .catch(async (error) => {
          //dealer code
          //send new embed be sure to set components to an empty array (components: [] )
          //
        });

      if (!userInteraction) return;

      const userChoice = choices.find(
        (choice) => choice.name === userInteraction.customId
      );

      await userInteraction.reply({
        content: `You picked ${userChoice.name}`,
        ephemeral: true,
      });

      //Edit embed with updated user turn

      let result;

      //create win conditions
      //compare interation.user.id cards value to bot's cards value
      //if tie bot wins
    } catch (error) {
      console.log(error);
    }
  },

  name: "blackjack",
  description: "Play a game of blackjack.",
  options: [
    {
      name: "amount",
      description: "The amount you want to gamble",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
};
