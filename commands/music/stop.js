const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    const Return = new Discord.MessageEmbed().setColor("RANDOM")

    if (!message.member.voice.channel) return message.channel.send(Return.setDescription(`You aren\'t connected to a voice channel!`));

    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
        return message.channel.send(Return.setDescription(`You aren\'t in the same voice channel as me!`));
    };
    
    if(!message.guild.me.voice.channel) return message.channel.send(Return.setDescription(`I'm not connected to a voice channel!`));
    message.guild.me.voice.channel.leave();
    client.queue.delete(message.guild.id);
};

module.exports.help = {
	name: "stop",
    aliases: ["leave", "disconnect"],
};