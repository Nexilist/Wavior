const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    const serverQueue = client.queue.get(message.guild.id);
    const Return = new Discord.MessageEmbed().setColor("RANDOM")

    if (!message.member.voice.channel) return message.channel.send(Return.setDescription(`You aren\'t connected to a voice channel!`));

    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
        return message.channel.send(Return.setDescription(`You aren\'t in the same voice channel as me!`));
    };
    
    if(!message.guild.me.voice.channel) return message.channel.send(Return.setDescription(`I'm not connected to a voice channel!`));
    if(!serverQueue) return message.channel.send(Return.setDescription('There is nothing currently playing.'));

    const embed = new Discord.MessageEmbed().setThumbnail(serverQueue.songs[0].thumbnail).setTitle("Now Playing:").setColor("RANDOM")
        .setDescription(`[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})\n\`[${formatSeconds((serverQueue.connection.dispatcher.streamTime - serverQueue.connection.dispatcher.pausedTime) / 1000)} / ${formatSeconds(serverQueue.songs[0].duration)}]\``)
        .addFields(
            { name: "Looping:", value: `${serverQueue.songs[0].loop}`, inline: true},
            { name: "Requested By:", value: `${serverQueue.songs[0].requested}`, inline: true },
            { name: "Author:", value: `[${serverQueue.songs[0].author}](${serverQueue.songs[0].authorUrl})`, inline: true}
        );
    message.channel.send(embed);
};

module.exports.help = {
	name: "nowplaying",
    aliases: ["np", "playing"],
};

formatSeconds = (seconds) => {
    return new Date(seconds * 1000).toISOString().substr(11, 8)
};