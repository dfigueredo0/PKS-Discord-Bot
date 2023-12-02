module.exports = client => {
    client.on('guildMemberAdd', member => {
        const channelID = '1179690454007156777';

        const message = `**Welcome to the server**, <@${member.id}>`;
        const channel = member.guild.channels.cache.get(channelID);

        channel.send(message);
    })
}