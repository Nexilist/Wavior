const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    const serverQueue = client.queue.get(message.guild.id);
    const embedreturn = new Discord.MessageEmbed().setColor("RANDOM")

    if (!message.member.voice.channel) return message.channel.send(embedreturn.setDescription(`You aren\'t connected to a voice channel!`));

    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
        return message.channel.send(embedreturn.setDescription(`You aren\'t in the same voice channel as me!`));
    };
    
    if(!message.guild.me.voice.channel) return message.channel.send(embedreturn.setDescription(`I'm not connected to a voice channel!`));
    if(!serverQueue) return message.channel.send(embedreturn.setDescription('There is nothing currently playing.'));

    const streamedTime = serverQueue.connection.dispatcher.streamTime

    const passedTimeInMSObj = {
      seconds: Math.floor((streamedTime / 1000) % 60),
      minutes: Math.floor((streamedTime / (1000 * 60)) % 60),
      hours: Math.floor((streamedTime / (1000 * 60 * 60)) % 24)
    };

    const passedTimeFormatted = formatDuration(passedTimeInMSObj);

    const embed = new Discord.MessageEmbed().setThumbnail(serverQueue.songs[0].thumbnail).setTitle("Now Playing:").setColor("RANDOM")
        .setDescription(`[${serverQueue.songs[0].title}](${serverQueue.songs[0].url})\n\`[${passedTimeFormatted} / ${serverQueue.songs[0].duration}]\``)
        .addFields(
            { name: "Looping:", value: `${serverQueue.songs[0].loop}`, inline: true},
            { name: "Requested By:", value: `${serverQueue.songs[0].requested}`, inline: true },
            { name: "Author:", value: `[${serverQueue.songs[0].author}](${serverQueue.songs[0].authorUrl})`, inline: true}
        );
    message.channel.send(embed);
}

module.exports.help = {
	name: "nowplaying",
    aliases: ["np", "playing"],
}

function formatDuration(durationObj) {
    const duration = `${durationObj.hours ? durationObj.hours + ':' : ''}${
      durationObj.minutes ? durationObj.minutes : '00'
    }:${
      durationObj.seconds < 10
        ? '0' + durationObj.seconds
        : durationObj.seconds
        ? durationObj.seconds
        : '00'
    }`;
    return duration;
}
