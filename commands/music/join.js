const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    if (!message.member.voice.channel) return message.channel.send('You aren\'t connected to a voice channel!');
    const permissions = message.member.voice.channel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT')) return message.channel.send('**Missing Permissions**: \`CONNECT\`');
    await message.member.voice.channel.join();
    message.channel.send(`Joined **${message.member.voice.channel.name}**!`);
};

module.exports.help = {
    name: "join",
    aliases: [],
};