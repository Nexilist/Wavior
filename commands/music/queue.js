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
    const pageBack = "◀️";
    const pageForward = "▶️";
    const num_per_page = 10; 
    let queuedVideos = serverQueue.songs.slice();
    let pageContents = [];
    while (queuedVideos.length > 0) { pageContents.push(queuedVideos.splice(0, num_per_page)) };
    let num_pages = pageContents.length; 
    let currentPage = 0;
    let currentListNum = ((currentPage + 1) * num_per_page) - num_per_page;
    let title = `Total songs: ${serverQueue.songs.length}`;
    let description = `Page ${currentPage+1} of ${num_pages} | Queue loop: ${serverQueue.loop}\n\n${pageContents[currentPage].map((song, index) => 
        `${currentListNum+(index+1)}:  [${song.title}](${song.url})`).join('\n')}\n\n`;
    description += `**Now Playing:** [${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`;
    const embeda = new Discord.MessageEmbed().setTitle(title).setColor('RANDOM').setDescription(description);
    const msg = await message.channel.send(embeda);
    if (num_pages <= 1) return;
    msg.react(pageBack);
    msg.react(pageForward);
    const filter = (reaction) => reaction.emoji.name === pageBack || reaction.emoji.name === pageForward;
    const collector = msg.createReactionCollector(filter, { time: 60000 });
    collector.on("collect", (reaction, user) => {
        if (user.bot) return;
        queuedVideos = serverQueue.songs.slice();
        pageContents = [];
        while (queuedVideos.length > 0) {pageContents.push(queuedVideos.splice(0, num_per_page))};
        num_pages = pageContents.length;
        switch (reaction.emoji.name) {
            case pageBack: {
                currentPage = currentPage == 0 ? pageContents.length - 1 : currentPage -= 1;
                break;
            }
            case pageForward: {
                currentPage = currentPage == pageContents.length - 1 ? 0 : currentPage += 1;
                break;
            }
        }
        reaction.users.remove(user);
        currentListNum = ((currentPage + 1) * num_per_page) - num_per_page;
        let title = `Total songs: ${serverQueue.songs.length}`;
        let description = `**Page ${currentPage+1} of ${num_pages} | Queue loop: ${serverQueue.loop}\n\n${pageContents[currentPage].map((song, index) => 
            `${currentListNum+(index+1)}:  [${song.title}](${song.url})`).join('\n')}\n\n`;
        description += `**Now Playing:** [${serverQueue.songs[0].title}](${serverQueue.songs[0].url})`;
        embeda.setTitle(title).setDescription(description);
        msg.edit(embeda);
    });
};

module.exports.help = {
	name: "queue",
    aliases: [],
};