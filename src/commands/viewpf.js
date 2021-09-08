const Discord = require('discord.js')
const fs = require('fs')

module.exports = {
    name: 'View Profile',
    permission: 'SEND_MESSAGES',
    slash: {
        name: 'View Profile',
        type: "USER",
        dafaultPermission: true,
    },
    execute(bot, i){
        let data = require('../../data.json')
        let user = i.guild.members.cache.get(i.targetId)
        if(!user) user = i.user
        else user = user.user
        if(!data[user.id]){
            data[user.id] = {
                wins: 0,
                losses: 0,
                draws: 0
            }
        }
        i.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setTitle(user.tag+'\'s Stats')
                .setColor('#b00b1e')
                .addField('Wins', `${data[user.id].wins}`)
                .addField('Losses', `${data[user.id].losses}`)
                .addField('Draws', `${data[user.id].draws}`)
                .addField('Win/Loss Ratio', `${data[user.id].wins/(data[user.id].losses || 1)}`)
            ]
        })
        fs.writeFileSync('./data.json', JSON.stringify(data))
    }
}