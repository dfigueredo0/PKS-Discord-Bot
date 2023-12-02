const { Client, Interaction } = require('discord.js');
const User = require('../../schemas/User');

const allowanceAmount = 1000;

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

        try {
            await interaction.deferReply();

            const query = {
                userID: interaction.member.id,
                guildID: interaction.guild.id,
            };

            let user = await User.findOne(query);

            if (user) {
                const lastDailyDate = user.lastDaily.toDateString();
                const currentDate = new Date().toDateString();

                if(lastDailyDate === currentDate) {
                    interaction.editReply(
                        "You have already colelcted you allowance today. Come back tomorrow."
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

            user.balance += allowanceAmount;
            await user.save();

            interaction.editReply(
                `$${allowanceAmount} was added to your balance. Your new balance is $${user.balance}`
            );
        } catch (error) {
            console.log(`${error}`);
        }
    },

    name: 'allowance',
    description: 'Collect your daily allowance',
};