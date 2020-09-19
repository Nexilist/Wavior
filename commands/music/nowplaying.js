const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    const serverQueue = client.queue.get(message.guild.id);
    if (!message.member.voice.channel) return message.channel.send('You aren\'t connected to a voice channel!');

    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
        return message.channel.send(`You aren\'t in the same channel as me!`);
    };
    
    if(!message.guild.me.voice.channel) return message.channel.send('I\'m not connected to a voice channel!');
    if(!serverQueue) return message.channel.send('There is nothing currently playing.');

    const embed = new Discord.MessageEmbed().setThumbnail(serverQueue.songs[0].thumbnail).setTitle("Now Playing:").setColor("RANDOM")
        .setDescription(`[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})\n\`[${formatSeconds(serverQueue.songs[0].duration - (serverQueue.connection.dispatcher.streamTime / 1000))} / ${formatSeconds(serverQueue.songs[0].duration)}]\``)
        .addFields(
            { name: "Looping:", value: `${serverQueue.songs[0].loop}`, inline: true},
            { name: "Requested By:", value: `${serverQueue.songs[0].requested}`, inline: true },
            { name: "Up Next:", value: serverQueue.songs.length > 1 ? `[${serverQueue.songs[1].title}](${serverQueue.songs[1].url})` : "None", inline: true},
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