const Discord = require('discord.js')

module.exports = {
    name: 'board',
    permission: 'SEND_MESSAGES',
    slash: {
        name: 'board',
        description: 'View your current game\' board'
    },
    execute(bot, i, games, gamestates){
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
        })
    }
}