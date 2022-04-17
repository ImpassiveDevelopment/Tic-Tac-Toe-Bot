const Discord = require('discord.js')

module.exports = {
    name: 'how',
    permission: 'SEND_MESSAGES',
    slash: {
        name: 'how',
        description: 'Get a basic how-to on Tic Tac Toe',
        dafaultPermission: true,
    },
    execute(bot, i){
        i.reply({
            embeds: [
                new Discord.MessageEmbed()
                .setTitle("How To Play Tic Tac Toe")
                .setColor('#b00b1e')
                .setDescription(`Tic Tac Toe is played on a 3x3 grid of squares:\n\` \` 1️⃣ 2️⃣ 3️⃣\n\`A\` ⬛|⬛|⬛\n\`B\` ⬛|⬛|⬛\n\`C\` ⬛|⬛|⬛\n\nOne player is an x, and one player is an o. Both of you compete to have three letter in a row before the other player. You take turns by putting your letter in an empty square.\n\nWhen all 9 squares are occupied, the game is over. If neither player has three of their letters in a row, the game is a draw.`)
            ]
        })
    }
}