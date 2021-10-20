const Discord = require('discord.js')
const fs = require('fs')
const commands = require('../globalfuncs/commands')

module.exports = {
    name: 'profile',
    permission: 'SEND_MESSAGES',
    slash: {
        name: 'profile',
        description: 'View a player\'s stats',
        dafaultPermission: true,
        options: [
            {
                name: 'member',
                description: 'The member who\'s stats you wish to view',
                required: false,
                type: 'USER'
            }
        ]
    },
    execute(bot, i){
        let data = require('../../data.json')
        let user = i.options.get('member')
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
        }).then(() => {
            commands.add_command("Profile")
        }).catch(err => {
            commands.add_error("Profile", err)
        })
        fs.writeFileSync('./data.json', JSON.stringify(data))
    }
}