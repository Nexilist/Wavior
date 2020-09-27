const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    if (message.author.id !== "567616465268768779") return;
    try {
        const result = new Discord.MessageEmbed().setColor("RANDOM")
        const url = args[0] ? args[0].replace(/<(.+)>/g, '$1') : ' '
        const dalink = decodeURIComponent(url)
        result.setDescription(`**Result** : \n${dalink}`)
        message.channel.send(result)
    }
    catch (error) { return; }
};

module.exports.help = {
	name: "decode",
    aliases: [],
};
