const Discord = require("discord.js");
const search = require("yt-search")

let emojis = {1: "**1**", 2: "**2**", 3: "**3**", 4: "**4**", 5: "**5**", 6: "**6**", 7: "**7**", 8: "**8**", 9: "**9**", 10: "**10**"}

module.exports.run = async (client, message, args) => {
    search(args.join(' '), async function(err, res) {
        if(err) console.log(err)
        let videos = res.videos.slice(0, 10)
        let searchMsg = new Discord.MessageEmbed().setTitle("Search Results:").setColor("RANDOM").setThumbnail("https://i.imgur.com/xS9EETM.png")
        let desc = ""
        for (var i in videos){
            desc += `${emojis[parseInt(i)+1]}:  ${Discord.escapeMarkdown(videos[i].title)}\n`
        }
        desc += `\n**Choose a number between 0 - ${videos.length} within 10 seconds.**`
        searchMsg.setDescription(desc)
        message.channel.send(searchMsg)
        const filter = m => !isNaN(m.content) && m.content < videos.length+1 && m.content > 0
        const collector = message.channel.createMessageCollector(filter, { time: 10000 })
        collector.videos = videos
        collector.once('collect', function(m) {
            let commandFile = require(`./play.js`)
            commandFile.run(client, message, [this.videos[parseInt(m.content)-1].url])
        })
    })
}

module.exports.help = {
	name: "search",
    aliases: ["yt"],
};
