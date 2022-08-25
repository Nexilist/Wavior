const Discord = require('discord.js');
const YouTube = require('simple-youtube-api');
const YTDL = require('ytdl-core');

const youtube = new YouTube(" -- Token Here -- ");

module.exports.run = async (client, message, args) => {
	const searchString = args.slice(1).join(' ');   
    const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : ' ';
    const serverQueue = client.queue.get(message.guild.id);
    const Return = new Discord.MessageEmbed().setColor("RANDOM")

    const VoiceChannel = message.member.voice.channel;
    if (!VoiceChannel) return message.channel.send(Return.setDescription(`You aren\'t connected to a voice channel!`));

    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
        return message.channel.send(Return.setDescription(`You aren\'t in the same voice channel as me!`));
    };

    const permissions = VoiceChannel.permissionsFor(message.client.user);
    if (!permissions.has('CONNECT')) return message.channel.send(Return.setDescription(`Missing Permissions: **CONNECT**`));
    if (!permissions.has('SPEAK')) return message.channel.send(Return.setDescription(`Missing Permissions: **SPEAK**`));

    if (serverQueue && !serverQueue.playing && !args[0]) {
        serverQueue.playing = true;
        serverQueue.connection.dispatcher.resume();
        return;
    };

    if (!args[0]) return;

    if (url.match(/^https?:\/\/(www.youtube.com|youtube.com)\/playlist(.*)$/)) {
        const playlist = await youtube.getPlaylist(url);
        const videos = await playlist.getVideos();
        let videonum = 0;
        for (const video of videos) {
            try {
                ++videonum;
                const video2 = await youtube.getVideoByID(video.id);
                if (serverQueue && serverQueue.stopped) return;
                await HandleVideo(client, video2, message, VoiceChannel, true);
            }
            catch (error) {
                console.error(error);
                videos.shift();
            };
        };
        return message.channel.send(Return.setDescription(`**${playlist.title}** has been added to the queue!`));
    }
    else {
        let validate = await YTDL.validateURL(args[0])
        if (validate) {
            var video = await youtube.getVideo(url);
        }
        else {
            try {
                var videos = await youtube.searchVideos(searchString, 1);
                video = await youtube.getVideoByID(videos[0].id);
            } catch {
                console.error(err);
                return message.channel.send(Return.setDescription('No search results were found!'));
            };
        };
        return HandleVideo(client, video, message, VoiceChannel);
    };
}

async function HandleVideo(client, video, message, voiceChannel, playlist = false) {
    const serverQueue = client.queue.get(message.guild.id);
    const song = {
        id: video.id,
        title: Discord.escapeMarkdown(video.title),
        url: `https://www.youtube.com/watch?v=${video.id}`,
        duration : `${formatDuration(video.duration)}`,
        requested: message.author,
        thumbnail: `https://i3.ytimg.com/vi/${video.id}/maxresdefault.jpg`,
        loop: false,
        author: `${video.channel.title}`,
        authorUrl: `https://www.youtube.com/channel/${video.channel.id}`
    };
    if(!serverQueue) {
        const queueConstruct = {
            textChannel: message.channel,
            voiceChannel: voiceChannel,
            connection: null,
            songs: [],
            volume: 100,
            loop: false,
            playing: true,
        };
        client.queue.set(message.guild.id, queueConstruct);
        queueConstruct.songs.push(song);
        try {
            var connection = await voiceChannel.join();
            queueConstruct.connection = connection;
            PlaySong(client, message.guild, queueConstruct.songs[0]);
            const playing = new Discord.MessageEmbed().setTitle("Now Playing:").setColor("RANDOM")
                .setDescription(`[${video.title}](${video.url})\n\`[${queueConstruct.songs[0].duration}]\``)
                .setThumbnail(queueConstruct.songs[0].thumbnail)
                .setFooter(`Requested By: ${queueConstruct.songs[0].requested.tag}`)
            message.channel.send(playing);
        } 
        catch(error) {
            console.error(`Could not join the voice channel: ${error}`);
            client.queue.delete(message.guild.id);
            const errora = new Discord.MessageEmbed().setColor("RANDOM")
            return message.channel.send(errora.setDescription(`Could not join the voice channel: ${error}`));
        }
    }
    else {
        serverQueue.songs.push(song);
        const playlista = new Discord.MessageEmbed().setColor("RANDOM")
        if(playlist) return;
        else return message.channel.send(playlista.setDescription(`**${song.title}** has been added to the queue!`));
    }
    return;
};

async function PlaySong(client, guild, song) {
    const serverQueue = client.queue.get(guild.id);
    if(!song){
        client.queue.delete(guild.id);
        return;
    }
    const dispatcher = serverQueue.connection.play(await YTDL(song.url, { filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1024 * 1024 * 10 }))
    .on('finish', reason => {
        const currentSong = serverQueue.songs[0];
        if (currentSong) {
            if (serverQueue.songs.length > 0) {
                if (!currentSong.loop && !serverQueue.loop) serverQueue.songs.shift();
                if (!currentSong.loop && serverQueue.loop) serverQueue.songs.push(serverQueue.songs.shift());
            }
        }
        PlaySong(client, guild, serverQueue.songs[0]);
    })
    dispatcher.setVolumeLogarithmic(serverQueue.volume / 100);
    serverQueue.connection.on("disconnect", () => {client.queue.delete(guild.id)})
};

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

module.exports.help = {
	name: "play",
    aliases: ["p"],
}
