const { Client, Message } = require('discord.js');
const Level = require('../../schemas/Level');
const calculateLevelXP = require('../../utils/calculateLevelXP');
const cooldowns = new Set();

function getRandomXP(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * 
 * @param {Client} client 
 * @param {Message} message 
 */

module.exports = async (client, message) => {
    if (!message.inGuild() || message.author.bot || cooldowns.has(message.author.id))
        return;
    const xpToGive = getRandomXP(1, 100); 

    const query = {
        userID: message.author.id,
        guildID: message.guild.id,
    };

    try {
        const level = await Level.findOne(query)

        if(level) {
            level.xp += xpToGive;

            if (level.xp > calculateLevelXP(level.level)) {
                level.xp = 0;
                level.level += 1;
                
                message.channel.send(`${message.member} you have leveled up to **level ${level.level}**.`);
            }

            await level.save().catch((e) => {
                console.log(`${e}`);
            });
            cooldowns.add(message.author.id);
            setTimeout(() => {
                cooldowns.delete(message.author.id);
            }, 45000);
        } else {
            const newLevel = new Level({
                userID: message.author.id,
                guildID: message.guild.id,
                xp: xpToGive,
            });

            await newLevel.save();
            cooldowns.add(message.author.id);
            setTimeout(() => {
                cooldowns.delete(message.author.id);
            }, 45000);
        }
    } catch (error) {
        console.log(`${error}`);
    }
}