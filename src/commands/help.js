const Discord = require('discord.js')
const commands = require('../globalfuncs/commands')

module.exports = {
    name: 'help',
    permission: 'SEND_MESSAGES',
    slash: {
        name: 'help',
        description: 'View a list of commands',
        dafaultPermission: true,
    },
    execute(bot, i){
        i.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setTitle("Tic Tac Toe Commands")
                .setColor('#b00b1e')
                .addField(`<:slash:873820777932279828>help`, 'View the help embed')
                .addField(`<:slash:873820777932279828>game <member>`, "Start a game with the selected member\n**Member** - The member you wish to challenge")
                .addField(`<:slash:873820777932279828>move <square>`, "Take your turn\n**Square** - A valid space on the board")
                .addField(`<:slash:873820777932279828>end`, "End your current game")
                .addField(`<:slash:873820777932279828>board`, "View your current game's board")
                .addField(`<:slash:873820777932279828>how`, "Get a small how-to of tic-tac-toe")
                .addField(`<:slash:873820777932279828>invite `, "Get the bot invite link")
                .addField(`<:slash:873820777932279828>stats`, "View some stats on the bot")
                .addField(`<:slash:873820777932279828>profile {member}`, "View a member stats or your own!\n**Member** - The member who's stats you want to view")
                .addField(`<:slash:873820777932279828>changelog {version}`, "View the change log\n**Version** - The specific version you want to view the changes for")
                .setDescription("Want to support development? [Upvote the bot on top.gg](https://top.gg/bot/762833969183326228/vote)")
                .setFooter('<> - Required Arguments || {} - Optional Arguments')
            ]
        }).then(() => {
            commands.add_command("Help")
        }).catch(err => {
            commands.add_error("Help", err)
        })
    }
}