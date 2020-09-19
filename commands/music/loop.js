const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    const serverQueue = client.queue.get(message.guild.id);
    
    if (!message.member.voice.channel) return message.channel.send('You aren\'t connected to a voice channel!');

    if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
        return message.channel.send(`You aren\'t in the same channel as me!`);
    };

    if(!message.guild.me.voice.channel) return message.channel.send('I\'m not connected to a voice channel!');

    const embed = new Discord.MessageEmbed();

    if(serverQueue && serverQueue.playing) {
        if (!["song", "queue"].includes(args[0])) {
            embed.addFields(
                { name: "Song Loop:", value: `**${serverQueue.songs[0].loop}**`, inline: true },
                { name: "Queue Loop:", value: `**${serverQueue.loop}**`, inline: true },
            );
            return message.channel.send(embed);
        };
        switch (args[0]) {
            case "song": {
                if (serverQueue.songs[0].loop) {
                    serverQueue.songs[0].loop = false; 
                    embed.setDescription(`Song loop is set to: **${serverQueue.songs[0].loop}**`);
                    message.channel.send(embed);
                } else {
                    serverQueue.songs[0].loop = true; 
                    embed.setDescription(`Song loop is set to: **${serverQueue.songs[0].loop}**`);
                    message.channel.send(embed);
                }
                break;
            }
            case "queue": {
                if (serverQueue.loop) {
                    serverQueue.loop = false; 
                    embed.setDescription(`Queue loop is set to: **${serverQueue.loop}**`);
                    message.channel.send(embed);
                } else {
                    serverQueue.loop = true; 
                    embed.setDescription(`Queue loop is set to: **${serverQueue.loop}**`);
                    message.channel.send(embed);
                }
                break;
            }
        }
    } else message.channel.send('There is nothing currently playing');
};

module.exports.help = {
	name: "loop",
    aliases: ["repeat"],
};