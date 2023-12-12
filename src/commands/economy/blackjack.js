const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} = require('discord.js');
const User = require('../../schemas/User');

const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
const ranks = [
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'J',
  'Q',
  'K',
  'A',
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

function draw(deck) {
  return deck.pop();
}

function handValue(hand) {
  let total = 0;
  let numAces = 0;

  for (const card of hand) {
    const rank = card.split(' ')[0];
    if (rank === 'A') {
      numAces++;
      total += 11;
    } else if (rank === 'K' || rank === `Q` || rank === 'J') {
      total += 10;
    } else {
      total += parseInt(rank);
    }
  }

  while (total > 21 && numAces > 0) {
    total -= 10;
    numAces--;
  }

  return total;
}

function detWinner(pHand, dHand) {
  const pTotal = handValue(pHand);
  const dTotal = handValue(dHand);

  if (pTotal > 21) {
    return false;
  } else if (dTotal > 21) {
    return true;
  } else if (pTotal === dTotal) {
    return false;
  } else {
    return pTotal > dTotal ? true : false;
  }
}

const choices = [
  { name: 'Hit', emoji: '' },
  { name: 'Stay', emoji: '' },
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
        content: 'You can only run this command inside a server.',
        ephemeral: true,
      });
      return;
    }

    try {
      await interaction.deferReply();

      const amount = interaction.options.getNumber('amount');

      const deck = createDeck();
      shuffle(deck);

      const playerHand = [draw(deck), draw(deck)];
      const dealerHand = [draw(deck), draw(deck)];

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

      const embed = new EmbedBuilder()
        .setTitle('BlackJack')
        .addFields([
          {
            name: `Your Cards (${handValue(playerHand)})`,
            value: `${playerHand.join(', ')}`,
          },
          {
            name: `Dealer's Cards`,
            value: `${dealerHand[0]}`,
          },
        ])
        .setColor('Default');

      const buttons = choices.map((choice) => {
        return new ButtonBuilder()
          .setCustomId(choice.name)
          .setLabel(choice.name)
          .setStyle(ButtonStyle.Primary);
      });

      const row = new ActionRowBuilder().addComponents(buttons);

      const reply = await interaction.editReply({
        embeds: [embed],
        components: [row],
      });

      const userInteraction = await reply
        .awaitMessageComponent({
          filter: (i) => i.user.id === interaction.user.id,
          time: 5_000,
        })
        .catch(async (error) => {
          if (handValue(dealerHand) < 17) {
            dealerHand.push(draw(deck));
          }

          if (handValue(dealerHand) < 17) {
            dealerHand.push(draw(deck));
          }

          if (!detWinner(playerHand, dealerHand)) {
            embed
              .setFields([
                {
                  name: `Your Cards (${handValue(playerHand)})`,
                  value: `${playerHand.join(', ')}`,
                },
                {
                  name: `Dealer's Cards (${handValue(dealerHand)})`,
                  value: `${dealerHand.join(', ')}`,
                },
              ])
              .setFooter({ text: 'The dealer won!' });
            user.balance -= amount;
            await user.save();
          }
          await interaction.editReply({ embeds: [embed], components: [] });
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

  name: 'blackjack',
  description: 'Play a game of blackjack.',
  options: [
    {
      name: 'amount',
      description: 'The amount you want to gamble',
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
};
