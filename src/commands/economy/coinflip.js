const { Client, Interaction, ApplicationCommandOptionType} = require('discord.js');
const User = require('../../schemas/User')

module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
    callback: async (client, interaction) => {
        if(!interaction.inGuild()) {
            interaction.reply({
                content: 'You can only run this command inside a server.',
                ephemeral: true,
            });
            return;
        }

        const amount = interaction.options.getNumber('amount');
        
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
            interaction.editReply(
                `You don't have enough to gamble $${amount}`,
            );
            return;
        }

        const didWin = Math.random() > 0.5;

        if (!didWin) {
            user.balance -= amount;
            await user.save();

            interaction.editReply(
                "You didn't win anything, but remeber 90% of gambling addicts quit right before they're about to hit it big"
                );
            return;
        }

        const amountWon = Number((amount * (Math.random() + 0.55)).toFixed(0));

        user.balance += amountWon;
        await user.save();

        interaction.editReply(`You won $${amountWon}!\nNew balance: ${user.balance}`);
    },

    name: 'coinflip',
    description: 'Gamble your balance in a 50/50 chance.',
    options: [
        {
            name: 'amount',
            description: 'The amount you want to gamble.',
            type: ApplicationCommandOptionType.Number,
            required: true,
        }
    ]
}