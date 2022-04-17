const Discord = require('discord.js')

module.exports = {
    name: 'end',
    permission: 'SEND_MESSAGES',
    slash: {
        name: 'end',
        description: 'End the current game you are playing',
        dafaultPermission: true,
    },
    execute(bot, i, games, gamestates){
        if(!games.has(i.user.id)) return i.reply({content: 'You are not in a game!', ephemeral: true})
        let p = games.get(i.user.id)
        let tic = gamestates.get(p.gameId)
        games.delete(`${tic.xPlayer[0]}`)
        games.delete(`${tic.oPlayer[0]}`)
        tic.game.moveLog.push(`${i.user.username} ended the game!`)
        i.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setTitle(`Game Ended by ${i.user.username}`)
                .setColor('#b00b1e')
                .setDescription(`<@${tic.xPlayer[0]}> vs. <@${tic.oPlayer[0]}>`)
                .addField('Game Board', tic.game.visualize())
                .addField('Movelog', tic.game.moveLog.join('\n'))
            ]
        })
    }
}