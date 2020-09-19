const Discord = require("discord.js")
const fs = require("fs")

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

client.on('voiceStateUpdate', async (oldVoice, _) => {
    if (oldVoice.guild.voice.channel && oldVoice.guild.voice.channel.members.size === 1) {
        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(15000);
        const vcMembers = oldVoice.guild.voice.channel.members.size;
        if (!vcMembers || vcMembers < 2) {
            oldVoice.guild.me.voice.channel.leave();
            client.queue = new Map();
        };
    }
})  

client.login(`NzQ4NzI5NTc2OTU5NTA4NTMx.X0hqwQ.L255vMkwM9lfl40Gctf5zQXm0Bs`);