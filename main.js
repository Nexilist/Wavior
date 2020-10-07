const Discord = require("discord.js")
const fs = require("fs")
require('events').EventEmitter.prototype._maxListeners = 15;

const client = new Discord.Client()
client.queue = new Map()
client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.prefix = ";"
const Modules = []

fs.readdirSync('./commands/').forEach(file => {
    Modules.push(file)
})

Modules.forEach(c => {
    fs.readdir(`./commands/${c}/`, (err, files) => {
        if (err) throw err;
        files.forEach(f => {
            if(!(f.split(".").pop() === "js")) return
            const command = require(`./commands/${c}/${f}`) 
            client.commands.set(command.help.name, command)
            if (command.help.aliases && typeof command.help.aliases == "object") {
                command.help.aliases.forEach(alias => {
                    client.aliases.set(alias, command.help.name);
                });
            }
        })
    })
})

client.on("ready", () => {
    client.user.setActivity(`${client.prefix}help`, {type: `LISTENING`});
    console.log(`Logged as ${client.user.tag}`);
});

client.on("voiceStateUpdate", async (oldVoice, newVoice) => {                     
	if (!newVoice.guild.members.cache.get(client.user.id).voice.channelID) client.queue.delete(oldVoice.guild.id)
	if (oldVoice.id === client.user.id) return
	if (!oldVoice.guild.members.cache.get(client.user.id).voice.channelID) return
	if (oldVoice.guild.members.cache.get(client.user.id).voice.channel.id === oldVoice.channelID) {
		if (oldVoice.guild.voice.channel) {
			const delay = ms => new Promise(res => setTimeout(res, ms))
			await delay(15000)
            let vcMembers = oldVoice.guild.voice.channel.members
            vcMembers = vcMembers.filter(member => !member.user.bot)
			if (vcMembers.size === 0) {
                const player = client.queue.get(oldVoice.guild.id)
                if (player) {
                    oldVoice.guild.voice.channel.leave()
                    client.queue.delete(oldVoice.guild.id)
                }
                else { oldVoice.guild.voice.channel.leave() }
			}
		}
	}
})

client.on('message', async message => {
    if (message.author.bot) return;
    if (message.content.indexOf(client.prefix) !== 0) return;
    const args = message.content.slice(client.prefix.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();
    if(!cmd) return;
    if (client.commands.has(cmd)) command = client.commands.get(cmd); 
    else command = client.commands.get(client.aliases.get(cmd));
    if (command) command.run(client, message, args);
});

client.login(process.env.token);
