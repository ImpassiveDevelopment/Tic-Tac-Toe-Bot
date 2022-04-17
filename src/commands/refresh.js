const Discord = require('discord.js')
const fs = require('fs')

module.exports = {
    name: 'refresh',
    permission: 'SEND_MESSAGES',
    slash: {
        name: 'refresh',
        description: 'Refresh a command',
        defaultPermission: false,
        options: [
            {
                name: 'command',
                description: 'The command to be refreshed',
                required: true,
                type: 'STRING'
            }
        ]
    },
    execute(bot, i){
        let command = i.options.get('command').value;
        let bool = fs.readdirSync('./src/commands').filter(file => file.startsWith(command))
        if(!bool.length) return i.reply({
            content: 'That command file could not be found!',
            ephemeral: true
        })
        
        let commandfile = require(`./${command}.js`)
        bot.application.commands.create(commandfile.slash)
        i.reply("That command is being refreshed!")
    }
}