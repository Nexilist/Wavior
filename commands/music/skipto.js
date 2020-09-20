const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    const serverQueue = client.queue.get(message.guild.id);
    const Return = new Discord.MessageEmbed().setColor("RANDOM")

    if (!message.member.voice.channel) return message.channel.send(Return.setDescription(`You aren\'t connected to a voice channel!`));

    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
        return message.channel.send(Return.setDescription(`You aren\'t in the same voice channel as me!`));
    };
    
    if(!message.guild.me.voice.channel) return message.channel.send(Return.setDescription(`I'm not connected to a voice channel!`));
    if (!serverQueue) return message.channel.send(Return.setDescription('There is nothing currently playing.'));
    if (isNaN(args[0])) return message.reply(Return.setDescription(`Please provide a number.`))
    if ((args[0] > serverQueue.songs.length) || (args[0] && !serverQueue.songs[args[0] - 1])) return;
	if (serverQueue.loop) {
        for (let i = 0; i < args[0] - 2; i++) {
            serverQueue.songs.push(serverQueue.songs.shift());
        }
      } else serverQueue.songs = serverQueue.songs.slice(args[0] - 2);
      serverQueue.connection.dispatcher.end();
      serverQueue.textChannel.send(Return.setDescription(`**${args[0] - 1}** songs skipped`)).catch(console.error);
};

module.exports.help = {
    name: "skipto",
    aliases: [],
};