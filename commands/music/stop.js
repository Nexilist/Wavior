const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    if (!message.member.voice.channel) return message.channel.send('You aren\'t connected to a voice channel!');

    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
        return message.channel.send(`You aren\'t in the same channel as me!`);
    };
    
    if(!message.guild.me.voice.channel) return message.channel.send('I\'m not connected to a voice channel!');
    message.guild.me.voice.channel.leave();
    client.queue = new Map();
};

module.exports.help = {
	name: "stop",
    aliases: ["leave", "disconnect"],
};