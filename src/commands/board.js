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
        }).then(() => {
            commands.add_command("Board")
        }).catch(err => {
            commands.add_error("Board", err)
            i.channel.send({
                embeds: [
                    new Discord.MessageEmbed()
                    .setTitle('Game Board')
                    .setColor('#b00b1e')
                    .setDescription(`<@${game.xPlayer[0]}> vs. <@${game.oPlayer[0]}>`)
                    .addField('Game Board', game.game.visualize())
                ]
            }).then(() => {
                commands.debug.push(commands.now_string()+" - Board Command Resolved")
            }).catch(err => {
                commands.debug.push(commands.now_string()+" - Command Could Not Be Resolved!")
                commands.add_error("Board", err)
            })
        })
    }
}