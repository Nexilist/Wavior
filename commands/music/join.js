const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    const Return = new Discord.MessageEmbed().setColor("RANDOM")
    if (!message.member.voice.channel) return message.channel.send(Return.setDescription(`You aren\'t connected to a voice channel!`));
    const permissions = message.member.voice.channel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT')) return message.channel.send(Return.setDescription('Missing Permissions: **CONNECT**'));
    await message.member.voice.channel.join();
    message.channel.send(Return.setDescription(`Joined **${message.member.voice.channel.name}**!`));
};

module.exports.help = {
    name: "join",
    aliases: [],
};