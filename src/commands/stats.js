const Discord = require('discord.js')
const package = require('../../package.json')

function check(t){
    if(t < 10) return `0${t}`
    else return t
}
function toHMS(ms){
    var seconds = ms / 1000;
    var hours = parseInt( seconds / 3600 );
    seconds = seconds % 3600;
    var minutes = parseInt( seconds / 60 );
    seconds = Math.ceil(seconds % 60);
    return hours+":"+check(minutes)+":"+check(seconds);
}

module.exports = {
    name: 'stats',
    permission: 'SEND_MESSAGES',
    slash: {
        name: 'stats',
        description: 'View some stats on the bot',
        dafaultPermission: true,
    },
    execute(bot, i, games, gamestates){
        let data = require('../../data.json')
        let dependencies = []
        for(var j in Object.keys(package.dependencies)){
            dependencies.push(`${Object.keys(package.dependencies)[j]}@${package.dependencies[Object.keys(package.dependencies)[j]].split('').slice(1).join('')}`)
        }
        let ready = new Date(bot.readyTimestamp)
        let readystring = `${ready.getMonth()}/${ready.getDate()}/${ready.getFullYear()} at ${ready.getHours()}:${check(ready.getMinutes())}`
        i.reply({
            embeds: [
              new Discord.MessageEmbed()
              .setTitle("Tic-Tac-Toe Stats")
              .setColor('#b00b1e')
              .setDescription(`Uptime - ${toHMS(Date.now()-bot.readyTimestamp)}`)
              .addField('Ready Since', readystring)
              .addField('Message Ping', `${i.createdTimestamp - Date.now()}ms`)
              .addField('API Ping', `${Math.round(bot.ws.ping)}ms`)
              .addField('Code Version', `v${package.version}`)
              .addField('Dependencies', dependencies.join('\n'))
              .addField('Server Count', `${bot.guilds.cache.size}`)
              .addField('Total Number of Games', `${data.system.games}`)
            ]
        })
    }
}