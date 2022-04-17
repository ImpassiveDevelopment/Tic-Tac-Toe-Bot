const Discord = require('discord.js')

module.exports = {
    name: 'invite',
    permission: 'SEND_MESSAGES',
    slash: {
        name: 'invite',
        description: 'Get the invite link for the bot',
        dafaultPermission: true,
    },
    execute(bot, i){
        i.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setTitle('Tic Tac Toe Bot Invite')
                .setColor('#b00b1e')
                .setDescription('Invite the bot using [this link!](https://discord.com/api/oauth2/authorize?client_id=762833969183326228&permissions=2048&scope=bot%20applications.commands)\n[Join the Impassive Development Support Server](https://discord.com/invite/mZpSX5y9Mp)')
            ]
        })
    }
}