const Discord = require('discord.js')
const nano = require('tic-tac-nano-2')
const fs = require('fs')
const move = require('../globalfuncs/move')

module.exports = {
    name: 'Challenge',
    permission: 'SEND_MESSAGES',
    slash: {
        name: 'Challenge',
        type: 'USER'
    },
    execute(bot, i, games, gamestates){
        let data = require('../../data.json')
        let user = i.guild.members.cache.get(i.targetId).user
        if(user.bot) return i.reply({content: 'You cannot challenge bots!', ephemeral: true})
        if(user.id === i.user.id) return i.reply({content: 'You cannot play yourself', ephemeral: true})
        if(games.has(user.id)) return i.reply({content: 'The user is in a game already!', ephemeral: true})
        if(games.has(i.user.id)) return i.reply({content: 'You are already in a game!', ephemeral: true})

        let embed = new Discord.MessageEmbed()
        .setTitle(`${i.user.tag} is challenging ${user.tag}`)
        .setColor('#b00b1e')
        .setDescription('Will they accept or deny?')
        .setFooter(`${user.tag} has 60 seconds to respond!`)

        let row = new Discord.MessageActionRow()
        .addComponents([
            new Discord.MessageButton()
            .setStyle("SUCCESS")
            .setLabel('Accept')
            .setCustomId('accept'),
            new Discord.MessageButton()
            .setStyle('DANGER')
            .setLabel('Decline')
            .setCustomId('decline')
        ])

        i.reply({content: 'Challenge Started!', ephemeral: true})
        
        i.channel.send({
            content: `<@${user.id}>`,
            embeds: [embed],
            components: [row]
        }).then(message => {
            const filter = (button) => button.user.id == user.id
            const collector = message.createMessageComponentCollector({filter, type: 'BUTTON', time: 60000})
            collector.on('collect', (button) => {
                if(button.customId == 'accept'){
                    button.deferUpdate()
                    collector.stop('Accept')
                    games.set(user.id, {
                        game: true,
                        gameId: data.system.games
                    })
                    games.set(i.user.id, {
                        game: true,
                        gameId: data.system.games
                    })
                    let x = '❌'
                    let o = '⭕'
                    gamestates.set(data.system.games, {
                        game: new nano(i.user.username, user.username, x, o, '⬛'),
                        xPlayer: [i.user.id, 'x'],
                        oPlayer: [user.id, 'o']
                    })
                    gamestates.get(data.system.games).turnPlayer = gamestates.get(data.system.games).xPlayer
                    let tic = gamestates.get(data.system.games)
                    data.system.games = data.system.games + 1
                    fs.writeFileSync('./data.json', JSON.stringify(data))
                    const buttons = {
                        A1: new Discord.MessageButton()
                        .setLabel(tic.game.emojis[tic.game.board.A1] || '⬛')
                        .setStyle('SECONDARY')
                        .setCustomId('A1'),
                        A2: new Discord.MessageButton()
                        .setLabel(tic.game.emojis[tic.game.board.A2] || '⬛')
                        .setStyle('SECONDARY')
                        .setCustomId('A2'),
                        A3: new Discord.MessageButton()
                        .setLabel(tic.game.emojis[tic.game.board.A3] || '⬛')
                        .setStyle('SECONDARY')
                        .setCustomId('A3'),
                        B1: new Discord.MessageButton()
                        .setLabel(tic.game.emojis[tic.game.board.B1] || '⬛')
                        .setStyle('SECONDARY')
                        .setCustomId('B1'),
                        B2: new Discord.MessageButton()
                        .setLabel(tic.game.emojis[tic.game.board.B2] || '⬛')
                        .setStyle('SECONDARY')
                        .setCustomId('B2'),
                        B3: new Discord.MessageButton()
                        .setLabel(tic.game.emojis[tic.game.board.B3] || '⬛')
                        .setStyle('SECONDARY')
                        .setCustomId('B3'),
                        C1: new Discord.MessageButton()
                        .setLabel(tic.game.emojis[tic.game.board.C1] || '⬛')
                        .setStyle('SECONDARY')
                        .setCustomId('C1'),
                        C2: new Discord.MessageButton()
                        .setLabel(tic.game.emojis[tic.game.board.C2] || '⬛')
                        .setStyle('SECONDARY')
                        .setCustomId('C2'),
                        C3: new Discord.MessageButton()
                        .setLabel(tic.game.emojis[tic.game.board.C3] || '⬛')
                        .setStyle('SECONDARY')
                        .setCustomId('C3')
                    }
                    const rowA = new Discord.MessageActionRow()
                    .addComponents([buttons.A1,buttons.A2,buttons.A3])
                    const rowB = new Discord.MessageActionRow()
                    .addComponents([buttons.B1,buttons.B2,buttons.B3])
                    const rowC = new Discord.MessageActionRow()
                    .addComponents([buttons.C1,buttons.C2,buttons.C3])
                    i.channel.send({
                        content: `<@${i.user.id}>`,
                        embeds: [
                            new Discord.MessageEmbed()
                            .setTitle(`${i.user.username} vs. ${user.username}`)
                            .setColor('#b00b1e')
                            .setDescription(tic.game.visualize())
                            .setFooter('Buttons will only be active for 60 seconds!')
                        ],
                        components: [
                            rowA,
                            rowB,
                            rowC
                        ]
                    }).then(msg => {
                        gamestates.get(data.system.games-1).lastMessage = msg.id
                        const collect = msg.createMessageComponentCollector({type: "BUTTON", time: 60000})
                        collect.on('collect', (b) => {
                            if(b.user != i.user){
                                b.reply({
                                    content: `Only ${i.user.username} can use these buttons!`,
                                    ephemeral: true
                                })
                            }else{
                                collect.stop(b.customId)
                                move(b, true, games, gamestates)
                            }
                        })
                        collect.on('end', (c, r) => {
                            if(r === 'time'){
                                msg.edit({
                                    content: 'The buttons have been removed due to not being used in 60 seconds. Use the move slash command to continue this game!',
                                    components: []
                                })
                            }else{
                                msg.edit({
                                    components: []
                                })
                            }
                        })
                    })
                }else{
                    collector.stop('Decline')
                }
            })
            collector.on('end', (c, r) => {
                if(r === 'time'){
                    message.edit({
                        embeds: [
                            new Discord.MessageEmbed()
                            .setTitle('Game Timed Out!')
                            .setColor('#b00b1e')
                            .setDescription(`${user.tag} did not respond in time!`)
                        ],
                        components: []
                    })
                }else if(r == 'Decline'){
                    message.edit({
                        embeds: [
                            new Discord.MessageEmbed()
                            .setTitle('Challenge Declined!')
                            .setColor('#b00b1e')
                            .setDescription(`${user.tag} has declined the challenge!`)
                        ],
                        components: []
                    })
                }else{
                    message.edit({
                        content: 'Challenge Accepted!',
                        embeds: [],
                        components: []
                    })
                }
            })
        })
    }
}