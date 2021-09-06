const Discord = require('discord.js')
const fs = require('fs')

function move(interaction, button, games, gamestates){
    let m
    if(button == true){
        m = interaction.customId
    }else{
        m = interaction.options.get('move').value
    }
    
    if(!games.has(interaction.user.id)) return interaction.reply({content: 'You are not in a game!', ephemeral: true})
    let player = games.get(interaction.user.id)
    let tic = gamestates.get(player.gameId)
    let mm = interaction.channel.messages.cache.get(tic.lastMessage)
    mm.edit({components: []})
    if(!tic.turnPlayer[0] == interaction.user.id) return interaction.reply({content: 'It is not your turn!', ephemeral: true})

    let db = require('../../data.json')
    if(!db[tic.xPlayer[0]]){
        db[tic.xPlayer[0]] = {
            wins: 0,
            losses: 0,
            draws: 0
        }
    }
    if(!db[tic.oPlayer[0]]){
        db[tic.oPlayer[0]] = {
            wins: 0,
            losses: 0,
            draws: 0
        }
    }

    let a = tic.game.turn(m, tic.turnPlayer[1])
    if(a == false) return interaction.reply({content: 'Invalid Move! Please use the move slash command to continue the game!', ephemeral: true})
    else{
        if(button == false) interaction.reply({content: 'Move Successful!', ephemeral: true})
        else interaction.deferUpdate()
        let embed = new Discord.MessageEmbed()
        .setTitle('Tic Tac Toe')
        .setColor('#b00b1e')
        .setDescription(`<@${tic.xPlayer[0]}> vs. <@${tic.oPlayer[0]}>\n${tic.game.visualize()}`)
        
        if(tic.game.didWin() != false && tic.game.didWin() != 'No one Wins'){
            embed.addField('Move Log', tic.game.moveLog.join('\n'))
            db[tic.turnPlayer[0]].wins+=1
            if(tic.turnPlayer == tic.xPlayer) db[tic.oPlayer[0]].losses+=1
            if(tic.turnPlayer == tic.oPlayer) db[tic.xPlayer[0]].losses+=1
            games.delete(tic.xPlayer[0])
            games.delete(tic.oPlayer[0])
            return interaction.channel.send({
                embeds: [embed]
            })
        }else if(tic.game.board.A1!='' && tic.game.board.A2!='' && tic.game.board.A3!='' && tic.game.board.B1!='' && tic.game.board.B2!='' && tic.game.board.B3!='' && tic.game.board.C1!='' && tic.game.board.C2!='' && tic.game.board.C3!=''){
            embed.addField('Move Log', tic.game.moveLog.join('\n'))
            db[tic.xPlayer[0]].draws+=1
            db[tic.oPlayer[0]].draws+=1
            games.delete(tic.xPlayer[0])
            games.delete(tic.oPlayer[0])
            return interaction.channel.send({
                embeds: [embed]
            })
        }else{
            if(tic.turnPlayer === tic.xPlayer){
                tic.turnPlayer = tic.oPlayer
            }else{
                tic.turnPlayer = tic.xPlayer
            }
        }
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
        interaction.channel.send({
            content: `<@${tic.turnPlayer[0]}>`,
            embeds: [embed],
            components: [
                rowA,
                rowB,
                rowC
            ]
        }).then(message => {
            gamestates.get(player.gameId).lastMessage = message.id
            const collector = message.createMessageComponentCollector({type: 'BUTTON', time: 60000})
            collector.on('collect', (button) => {
                if(button.user != tic.turnPlayer[0]){
                    button.reply({
                        content: `Only <@${tic.turnPlayer[0]}> can use these buttons!`,
                        ephemeral: true
                    })
                }else{
                    collector.stop(button.customId)
                    move(button, true, games, gamestates)
                }
            })
            collector.on('end', (c, r) => {
                if(r == 'time'){
                    message.edit({
                        content: 'The buttons have been removed due to not being used in 60 seconds. Use the move slash command to continue this game!',
                        components: []
                    })
                }else{
                    message.edit({
                        components: []
                    })
                }
            })
        })
    }

    fs.writeFileSync('./data.json', JSON.stringify(db))
}

module.exports = move