const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    const serverQueue = client.queue.get(message.guild.id);
    const Return = new Discord.MessageEmbed().setColor("RANDOM")

    if (!message.member.voice.channel) return message.channel.send(Return.setDescription(`You aren\'t connected to a voice channel!`));

    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
        return message.channel.send(Return.setDescription(`You aren\'t in the same voice channel as me!`));
    };
    
    if(!message.guild.me.voice.channel) return message.channel.send(Return.setDescription(`I'm not connected to a voice channel!`));
    if(!serverQueue) return message.channel.send(Return.setDescription('There is nothing currently playing!'));
    if (isNaN(args[0])) return message.channel.send(Return.setDescription('Please choose a valid number'));
    const video = serverQueue.songs.splice(args[0] - 1, 1)
    return message.channel.send(Return.setDescription(`Removed **${video[0].title}** from the queue`));
};

module.exports.help = {
	name: "remove",
    aliases: [],
};