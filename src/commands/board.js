const Discord = require('discord.js')
const commands = require('../globalfuncs/commands')

module.exports = {
    name: 'board',
    permission: 'SEND_MESSAGES',
    slash: {
        name: 'board',
        description: 'View your current game\' board',
        dafaultPermission: true,
    },
    execute(bot, i = new Discord.Interaction(), games, gamestates){
        if(!games.has(i.user.id)) return i.reply({content: 'You are not in a game!', ephemeral: true})
        let p = games.get(i.user.id)
        let game = gamestates.get(p.gameId)

        i.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setTitle('Game Board')
                .setColor('#b00b1e')
                .setDescription(`<@${game.xPlayer[0]}> vs. <@${game.oPlayer[0]}>`)
                .addField('Game Board', game.game.visualize())
            ]
        }).catch(err => {
            i.channel.send({
                embeds: [
                    new Discord.MessageEmbed()
                    .setTitle('Game Board')
                    .setColor('#b00b1e')
                    .setDescription(`<@${game.xPlayer[0]}> vs. <@${game.oPlayer[0]}>`)
                    .addField('Game Board', game.game.visualize())
                ]
            })
        })
    }
}