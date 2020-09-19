const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    const serverQueue = client.queue.get(message.guild.id);
    if (!message.member.voice.channel) return message.channel.send('You aren\'t connected to a voice channel!');

    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
        return message.channel.send(`You aren\'t in the same channel as me!`);
    };
    
    if(!message.guild.me.voice.channel) return message.channel.send('I\'m not connected to a voice channel!');
    if (!serverQueue) return message.channel.send('There is nothing playing that can be skipped.');
    
    if (!args[0])
        return message.channel.send(`The current volume is: **${serverQueue.volume}**`).catch(console.error);
    if (Number.isNaN(args[0])) return message.reply("Please use a number to set volume.").catch(console.error);
    if (parseInt(args[0]) > 200 || parseInt(args[0]) < 0)
        return message.reply("Please use a number between 0 - 200.").catch(console.error);

    serverQueue.volume = args[0];
    serverQueue.connection.dispatcher.setVolumeLogarithmic(args[0] / 100);
    serverQueue.textChannel.send(`Volume is now set to: **${args[0]}**`).catch(console.error);
}

module.exports.help = {
	name: "volume",
    aliases: [],
}