const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    const serverQueue = client.queue.get(message.guild.id);
    if (!message.member.voice.channel) return message.channel.send('You aren\'t connected to a voice channel!');

    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
        return message.channel.send(`You aren\'t in the same channel as me!`);
    };
    
    if(!message.guild.me.voice.channel) return message.channel.send('I\'m not connected to a voice channel!');
    if (!serverQueue) return message.channel.send('There is nothing currently playing.');
    if (isNaN(args[0])) return message.reply(`Please provide a number.`)
    if ((args[0] > serverQueue.songs.length) || (args[0] && !serverQueue.songs[args[0] - 1])) return message.channel.send('Song not found.');
	if (serverQueue.loop) {
        for (let i = 0; i < args[0] - 2; i++) {
            serverQueue.songs.push(serverQueue.songs.shift());
        }
      } else serverQueue.songs = serverQueue.songs.slice(args[0] - 2);
      serverQueue.connection.dispatcher.end();
      serverQueue.textChannel.send(`**${args[0] - 1}** skipped`).catch(console.error);
};

module.exports.help = {
    name: "skipto",
    aliases: [],
};