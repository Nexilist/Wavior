const Discord = require('discord.js');

module.exports.run = async (client, message, args) => {
    const prefix = client.prefix;
    const helpembed = new Discord.MessageEmbed().setAuthor("Wavior", "https://i.imgur.com/xS9EETM.png" , "https://axyzes.tk")
        .setColor('RANDOM')
        .addField('Commands:', `\`\`\`md\n<play Aliases="p">
<skip Aliases="next">
<search Aliases="yt">
<loop Aliases="repeat">
<nowplaying Aliases="playing , np">
<pause>
<resume Aliases="unpause">
<queue>
<remove>
<shuffle>
<volume>
<stop Aliases="leave , disconnect">
<clear>
<skipto>
<join>\`\`\``)
            .addField('Quick tutorial', '\`\`\`md\n# loop [Song / Queue]\`\`\`')
    message.channel.send(helpembed);
};

module.exports.help = {
	name: "help",
    aliases: ["commands", "cmds"],
};
