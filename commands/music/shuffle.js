const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    const serverQueue = client.queue.get(message.guild.id);
    const Return = new Discord.MessageEmbed().setColor("RANDOM")

    if (!message.member.voice.channel) return message.channel.send(Return.setDescription(`You aren\'t connected to a voice channel!`));

    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
        return message.channel.send(Return.setDescription(`You aren\'t in the same voice channel as me!`));
    };
    
    if(!message.guild.me.voice.channel) return message.channel.send(Return.setDescription(`I'm not connected to a voice channel!`));
    if(serverQueue && serverQueue.playing) {
        Shuffle(serverQueue.songs);
        message.channel.send(Return.setDescription('Shuffled the queue!'));
    } else message.channel.send(Return.setDescription('There is nothing currently playing.'));
};

module.exports.help = {
	name: "shuffle",
    aliases: ["random"],
};

function Shuffle(songs) {
    var j, temp, i;
    for (i = songs.length - 1; i > 1; i--) {
        j = Math.floor(Math.random() * (i + 1));
        while(j == 0) { j = Math.floor(Math.random() * (i + 1)); }
        temp = songs[i];
        songs[i] = songs[j];
        songs[j] = temp;
    };
};