require('dotenv').config()
const Discord = require('discord.js')
const nano = require('tic-tac-nano-2')
const fs = require('fs');
const DBL = require("dblapi.js");
const package = require('./package.json');
const ticTacNano = require('tic-tac-nano-2');
const slash = require('./slashcommands')

function mov(message, interaction, args, games, prefix){
  let move = args[0];
  if(!games.has(`${message.author.id}`)){
    return message.channel.send('You are not in a game!')
  }
  if(!args[0]){
    return message.channel.send('You must specify a move')
  }
  if(args[0].toLowerCase() == '1a') move = 'A1'
  if(args[0].toLowerCase() == '1b') move = 'B1'
  if(args[0].toLowerCase() == '1c') move = 'C1'
  if(args[0].toLowerCase() == '2a') move = 'A2'
  if(args[0].toLowerCase() == '2b') move = 'B2'
  if(args[0].toLowerCase() == '2c') move = 'C2'
  if(args[0].toLowerCase() == '3a') move = 'A3'
  if(args[0].toLowerCase() == '3b') move = 'B3'
  if(args[0].toLowerCase() == '3c') move = 'C3'
  move = move.split('')
  move[0] = move[0].toUpperCase()
  let mo = move.join('')

  if(!validMoves.has(mo)){
    return message.channel.send('That is not a valid tic tac toe board square')
  }
  let player = games.get(`${interaction.user.id}`);
  let tic = gameStates.get(player.gameId)
  if(interaction.user.id != tic.turnPlayer[0]){
    return message.channel.send('It is not your turn')
  }else{
    let a = tic.game.turn(mo, tic.turnPlayer[1])
    if(a === false){
      return message.channel.send('Invalid Move')
    }else{
      let embed = new Discord.MessageEmbed()
      .setTitle(`Tic Tac Toe`)
      .setColor('#b00b1e')
      .setDescription(`${message.guild.members.cache.get(tic.xPlayer[0])} vs. ${message.guild.members.cache.get(tic.oPlayer[0])}`)
      if(tic.game.didWin() != false && tic.game.didWin() != 'No one Wins'){
        embed.addField('Game Board', tic.game.visualize())
        embed.addField('Movelog', tic.game.moveLog.join('\n'))
        let db = require('./database.json')
        db[tic.turnPlayer[0]].wins+=1
        if(tic.turnPlayer == tic.xPlayer) db[tic.oPlayer[0]].losses+=1
        if(tic.turnPlayer == tic.oPlayer) db[tic.xPlayer[0]].losses+=1
        fs.writeFileSync('./database.json', JSON.stringify(db))
        games.delete(tic.xPlayer[0])
        games.delete(tic.oPlayer[0])
        return message.channel.send({embeds: [embed]})
      //Turns out, I forgot to put the draw condition smh
      }else if(tic.game.board.A1!='' && tic.game.board.A2!='' && tic.game.board.A3!='' && tic.game.board.B1!='' && tic.game.board.B2!='' && tic.game.board.B3!='' && tic.game.board.C1!='' && tic.game.board.C2!='' && tic.game.board.C3!=''){
        embed.addField('Game Board', tic.game.visualize())
        embed.addField('No Winner - Movelog', tic.game.moveLog.join('\n'))
        let db = require('./database.json')
        db[tic.xPlayer[0]].draws+=1
        db[tic.oPlayer[0]].draws+=1
        fs.writeFileSync('./database.json', JSON.stringify(db))
        games.delete(tic.xPlayer[0])
        games.delete(tic.oPlayer[0])
        return message.channel.send({embeds: [embed]})
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
  
      message.channel.send({
        content: `<@!${tic.turnPlayer[0]}>`,
        embeds: [
          embed
        ],
        components: [
          rowA,
          rowB,
          rowC
        ]
      }).then((m) => {
        const collector = m.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 });
        collector.on('collect', i => {
          if(i.user.id != tic.turnPlayer[0]){
            i.deferUpdate()
            i.channel.send({
              content: `Only ${message.guild.members.cache.get(tic.turnPlayer[0]).user.username} can use these buttons!`,
            })
          }else{
            i.deferUpdate()
            collector.stop(i.customId)
            mov(message, i, [i.customId], games, prefix)
          }
        })
        collector.on('end', (c, r) => {
          if(r != null){
            m.edit({
              embeds: [
                embed
                .addField('Game Board', tic.game.visualize())
              ],
              components: []
            })
          }
          else{
            m.edit({
              content: `The buttons will no longer work, so they have been removed. You can still continue the game using the \`${prefix}move\` command!`,
              embeds: [
                embed
                .addField('Game Board', tic.game.visualize())
              ],
              components: []
            })
          }
        })
      })
    }
  }
}


var games = new Map()
var gameStates = new Map()
var no = 0;

let validMoves = new Set();
validMoves.add('A1')
validMoves.add('B1')
validMoves.add('C1')
validMoves.add('A2')
validMoves.add('B2')
validMoves.add('C2')
validMoves.add('A3')
validMoves.add('B3')
validMoves.add('C3')

let intents = new Discord.Intents()
.add('DIRECT_MESSAGES')
.add('GUILDS')
.add('GUILD_MESSAGES')
.add('GUILD_MEMBERS')
.add('GUILD_PRESENCES')
console.log(intents)
const bot = new Discord.Client({intents: intents, partials: ['MESSAGE', 'CHANNEL', 'REACTION']})

function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

function toHMS(ms){
  var seconds = ms / 1000;
  var hours = parseInt( seconds / 3600 );
  seconds = seconds % 3600;
  var minutes = parseInt( seconds / 60 );
  seconds = Math.ceil(seconds % 60);
  return hours+":"+checkTime(minutes)+":"+checkTime(seconds);
}

bot.on('ready', async () => {
  console.log(`Logged in as ${bot.user.tag} in ${bot.guilds.cache.size} servers`)
	bot.user.setActivity({
		type: "WATCHING",
		name: `t!help || DM To Contact Developer!`
	})
  let db = require('./database.json')
  bot.guilds.cache.forEach(g => {
    let guild = db[g.id]
    if(!guild){
      db[g.id] = {
        prefix: 't!'
      }
    }
  })

  bot.users.cache.forEach(u => {
    let user = db[u.id]
    if(!user){
      db[u.id] = {
        wins: 0,
        losses: 0,
        draws: 0
      }
    }
  })

  fs.writeFileSync('./database.json', JSON.stringify(db))

  console.log('DB Write Complete!')

  //slash.initiate(bot)
})

bot.on('interactionCreate', async interaction => {
  if(!interaction.isCommand()) return
  if(!interaction.guild) return interaction.reply({
    content: 'Only available within servers',
    ephemeral: true
  })
  else{
    if(interaction.commandName == 'help'){
      let db = require('./database.json')
      let prefix = db[interaction.guild.id].prefix
      interaction.reply({
        embeds: [
          new Discord.MessageEmbed()
          .setTitle('Tic Tac Toe')
          .setColor('#b00b1e')
          .addField(`${prefix}help <:slash:873820777932279828>`, 'View the help embed')
          .addField(`${prefix}game <member>`, "Start a game with the selected memeber\n**Member** - The ID or mention of a member")
          .addField(`${prefix}move <square> <:slash:873820777932279828>`, "Take your turne\n**Square** - A valid space on the board")
          .addField(`${prefix}end`, "End your current game")
          .addField(`${prefix}board`, "View your current game's board")
          .addField(`${prefix}how <:slash:873820777932279828>`, "Get a small how-to of tic-tac-toe")
          .addField(`${prefix}invite <:slash:873820777932279828>`, "Get the bot invite link")
          .addField(`${prefix}stats {options} <:slash:873820777932279828>`, "View some stats on the bot\n**Options** - Focus on one area, uptime, ping, or development")
          .addField(`${prefix}setprefix {prefix}`, "Set the bot prefix\n**Prefix** - The prefix to set to, if blank will reset to default(t!)")
          .addField(`<:slash:873820777932279828>prefix`, "View the bot prefix\n*Slash command only")
          .addField(`${prefix}profile <:slash:873820777932279828>`, "View your wins/losses/draws")
          .setDescription("Want to support development? [Upote the bot on top.gg](https://top.gg/bot/762833969183326228/vote)\n<:slash:873820777932279828> - Available in slash command form")
          .setFooter('<> - Required Arguments || {} - Optional Arguments')
        ],
        ephemeral: true
      })
    }else if(interaction.commandName == 'how'){
      interaction.reply({
        embeds: [
          new Discord.MessageEmbed()
          .setTitle('How to play Tic Tac Toe')
          .setColor('#b00b1e')
          .setDescription(`Tic Tac Toe is played on a 3x3 grid of squares:\n\` \` 1️⃣ 2️⃣ 3️⃣\n\`A\` ⬛|⬛|⬛\n\`B\` ⬛|⬛|⬛\n\`C\` ⬛|⬛|⬛\n\nOne player is an x, and one player is an o. Both of you compete to have three letter in a row before the other player. You take turns by putting your letter in an empty square.\n\nWhen all 9 squares are occupied, the game is over. If neither player has three of their letters in a row, the game is a draw.`)
        ],
        ephemeral: true
      })
    }else if(interaction.commandName == 'invite'){
      interaction.reply({
        embeds: [
          new Discord.MessageEmbed()
          .setTitle('Tic Tac Toe Bot Invite')
          .setColor('#b00b1e')
          .setDescription('Invite the bot using [this link!](https://discord.com/api/oauth2/authorize?client_id=762833969183326228&permissions=2048&scope=bot%20applications.commands)\n[Join the Impassive Development Support Server](https://discord.com/invite/mZpSX5y9Mp)')
        ],
        ephemeral: true
      })
    }else if(interaction.commandName == 'stats'){
      let option = interaction.options.get('options')
      let dependencies = []
      for(var i in Object.keys(package.dependencies)){
        dependencies.push(`${Object.keys(package.dependencies)[i]}@${package.dependencies[Object.keys(package.dependencies)[i]]}`)
      }
      let ready = new Date(bot.readyTimestamp)
      let readystring = `${ready.getMonth()}/${ready.getDate()}/${ready.getFullYear()} at ${ready.getHours()}:${ready.getMinutes()}`
      if(option == null){
        interaction.reply({
          embeds: [
            new Discord.MessageEmbed()
            .setTitle("Tic-Tac-Toe Stats")
            .setColor('#b00b1e')
            .setDescription(`Uptime - ${toHMS(Date.now()-bot.readyTimestamp)}`)
            .addField('Ready Since', readystring)
            .addField('Message Ping', `${interaction.createdTimestamp - Date.now()}ms`)
            .addField('API Ping', `${Math.round(bot.ws.ping)}ms`)
            .addField('Code Version', `v${package.version}`)
            .addField('Dependencies', dependencies.join('\n'))
            .setFooter(`For only one field, do stats {option}`)
          ],
          ephemeral: true
        })
      }else if(option.value == 'uptime'){
        interaction.reply({
          embeds: [
            new Discord.MessageEmbed()
            .setTitle('Uptime')
            .setColor('#b00b1e')
            .setDescription(`**Ready Since**\n${readystring}\n**Uptme**\n${toHMS(Date.now()-bot.readyTimestamp)}`)
          ],
          ephemeral: true
        })
      }else if(option.value == 'ping'){
        interaction.reply({
          embeds: [
            new Discord.MessageEmbed()
            .setTitle('Latency')
            .setColor('#b00b1e')
            .setDescription(`**Message Ping**\n${interaction.createdTimestamp -  Date.now()}ms\n**API Ping**\n${Math.round(bot.ws.ping)}ms`)
          ],
          ephemeral: true
        })
      }else if(option.value == 'development'){
        interaction.reply({
          embeds: [
            new Discord.MessageEmbed()
            .setTitle('Development Information')
            .setColor('#b00b1e')
            .setDescription(`**Code Version**\nv${package.version}\n**Dependencies**\n${dependencies.join('\n')}`)
          ],
          ephemeral: true
        })
      }
    }else if(interaction.commandName == 'prefix'){
      let db = require('./database.json')
      let guild = db[interaction.guild.id]
      interaction.reply({
        content: `The bot's prefix is ${guild.prefix}`,
        ephemeral: true
      })
    }else if(interaction.commandName == 'profile'){
      let db = require('./database.json')
      let option = interaction.options.get('target')
      if(!option){
        let me = db[interaction.member.id]
        interaction.reply({
          embeds: [
            new Discord.MessageEmbed()
            .setTitle(`${interaction.member.user.tag}'s Profile`)
            .setColor('#b00b1e')
            .addField("Wins", me.wins.toString())
            .addField("Losses", me.losses.toString())
            .addField("Draws", me.losses.toString())
          ],
          ephemeral: true
        })
      }else{
        let me = db[option.user.id]
        interaction.reply({
          embeds: [
            new Discord.MessageEmbed()
            .setTitle(`${option.user.tag}'s Profile`)
            .setColor('#b00b1e')
            .addField("Wins", me.wins.toString())
            .addField("Losses", me.losses.toString())
            .addField("Draws", me.draws.toString())
          ],
          ephemeral: true
        })
      }
    }else if(interaction.commandName == 'move'){
      let option = interaction.options.get('square')
      let prefix = require('./database.json')[interaction.guild.id].prefix
      let message = {
        author: interaction.user,
        channel: interaction.channel,
        guild: interaction.guild
      }
      interaction.reply({
        content: `${interaction.user.tag} used the move command`
      })
      mov(message, interaction, [option.value], games, prefix)
    }
  }
})

bot.on('guildCreate', (guild) => {
  bot.channels.cache.get('872007635245862913').send(`I have been added to the guild \`${guild.name}\`\nServer Count - ${bot.guilds.cache.size}`)
  let db = require('./database.json')
  bot.guilds.cache.forEach(g => {
    let guild = db[g.id]
    if(!guild){
      db[g.id] = {
        prefix: 't!'
      }
    }
  })
  fs.writeFileSync('./database.json', JSON.stringify(db))
})

bot.on('guildDelete', (guild) => {
  bot.channels.cache.get('872007635245862913').send(`I have been removed from the guild \`${guild.name}\`\nServer Count - ${bot.guilds.cache.size}`)
})

bot.on('guildMemberAdd', (m) => {
  let db = require('./database.json')
  bot.guilds.cache.forEach(g => {
    let guild = db[g.id]
    if(!guild){
      db[g.id] = {
        prefix: 't!'
      }
    }
  })

  bot.users.cache.forEach(u => {
    let user = db[u.id]
    if(!user){
      db[u.id] = {
        wins: 0,
        losses: 0,
        draws: 0
      }
    }
  })
  fs.writeFileSync('./database.json', JSON.stringify(db))
})

bot.on('messageCreate', async message => {
  if(message.channel.type == 'DM'){
    if(message.author.bot) return;
    let embed = new Discord.MessageEmbed()
    .setTitle(`Mesage from \`${message.author.tag}\``)
    .setColor('#b00b1e')
    .setDescription(message.content)
    .setFooter(`Run the command \`tictactoe-reply ${message.author.id}\` to respond!`)
    message.channel.send('Message Sent!')
    let channel = bot.channels.cache.get('872006358654943232')
    channel.send({embeds: [embed]})
    return
  }
  let db = require('./database.json')
  let prefix = db[message.guild.id].prefix;
  let arr = message.content.split(' ')
  let cmd = arr[0];
  let args = arr.slice(1)
  if(message.content.startsWith('tictactoe-reply')){
    if(message.author.id != '558800844343214090') return
    if(!bot.users.cache.has(args[0])) return message.channel.send('I do not have conteact with that member!')
    else{
      let user = bot.users.cache.get(args[0])
      console.log(user)
      user.send({
        embeds: [
          new Discord.MessageEmbed()
          .setTitle('Response from Developer')
          .setColor('#b00b1e')
          .setDescription(args.slice(1).join(' '))
        ]
      })
      message.channel.send('Message Delivered!')
    }
  }
  if(!cmd.toLowerCase().startsWith(prefix)) return;
  cmd = cmd.toLowerCase().split('').slice(prefix.length).join('')

  if(cmd === 'help'){
    message.channel.send({
      embeds: [
        new Discord.MessageEmbed()
        .setTitle('Tic Tac Toe')
        .setColor('#b00b1e')
        .addField(`${prefix}help <:slash:873820777932279828>`, 'View the help embed')
        .addField(`${prefix}game <member>`, "Start a game with the selected memeber\n**Member** - The ID or mention of a member")
        .addField(`${prefix}move <square>`, "Take your turne\n**Square** - A valid space on the board")
        .addField(`${prefix}end`, "End your current game")
        .addField(`${prefix}board`, "View your current game's board")
        .addField(`${prefix}how <:slash:873820777932279828>`, "Get a small how-to of tic-tac-toe")
        .addField(`${prefix}invite <:slash:873820777932279828>`, "Get the bot invite link")
        .addField(`${prefix}stats {options} <:slash:873820777932279828>`, "View some stats on the bot\n**Options** - Focus on one area, uptime, ping, or development")
        .addField(`${prefix}setprefix {prefix}`, "Set the bot prefix\n**Prefix** - The prefix to set to, if blank will reset to default(t!)")
        .addField(`<:slash:873820777932279828>prefix`, "View the bot prefix\n*Slash command only")
        .addField(`${prefix}profile <:slash:873820777932279828>`, "View your wins/losses/draws")
        .setDescription("Want to support development? [Upote the bot on top.gg](https://top.gg/bot/762833969183326228/vote)\n<:slash:873820777932279828> - Available in slash command form")
        .setFooter('<> - Required Arguments || {} - Optional Arguments')
      ]
    })
  }

  if(cmd === 'game'){
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!member) return message.channel.send('You must challenge a member!')
    if(member.user.bot) return message.channel.send("You cannot challenge a bot!")
    if(member.user.id == message.author.id) return message.channel.send('You cannot challenge yourself!')
    if(games.has(`${message.author.id}`)){
      return message.channel.send('You are already in a game')
    }
    if(games.has(`${member.id}`)){
      return message.channel.send('The tagged person is in a game')
    }
    let embed = new Discord.MessageEmbed()
    .setTitle('New Challenge')
    .setColor('#b00b1e')
    .setDescription(`${message.author.tag} is challenging ${member.user.tag}\nWill they Accept or Deny`)
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
    message.channel.send({
      embeds: [embed],
      components: [row]
    }).then(m => {
      const filter = (button) => button.user.id == member.user.id
      const col = m.createMessageComponentCollector({filter, type: "BUTTON", time: 60000})
      col.on('collect', (b) => {
        if(b.customId == 'accept'){
          m.edit({
            content: 'Challenge Accepted!',
            embeds: [],
            components: []
          })
          games.set(`${message.author.id}`, {
            game: true,
            gameId: no,
          })
          games.set(`${member.id}`, {
            game: true,
            gameId: no,
          })
          let x = args[1] || '❌';
          let o = args[2] || '⭕';
          gameStates.set(no, {
            game: new nano(message.member.user.username, member.user.username, x, o, '⬛'),
            xPlayer: [message.author.id, 'x'],
            oPlayer: [member.id, 'o'],
          })
          gameStates.get(no).turnPlayer = gameStates.get(no).xPlayer;
          let tic = gameStates.get(no);
          no++;
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
      
          message.channel.send({
            embeds: [
              new Discord.MessageEmbed()
              .setTitle(`Tic Tac Toe`)
              .setColor('#b00b1e')
              .setDescription(`${message.member} vs. ${member}`)
            ],
            components: [
              rowA,
              rowB,
              rowC
            ]
          }).then((m) => {
            const collector = m.createMessageComponentCollector({ componentType: 'BUTTON', time: 60000 });
            collector.on('collect', i => {
              if(i.user.id != message.author.id){
                i.deferUpdate()
                i.channel.send({
                  content: `Only ${message.guild.members.cache.get(tic.turnPlayer[0]).user.username} can use these buttons!`,
                })
              }else{
                i.deferUpdate()
                collector.stop(i.customId)
              }
            })
            collector.on('end', (c, r) => {
              if(r != null){
                mov(message, {user:{id:message.author.id}}, [r], games, prefix)
                m.edit({
                  embeds: [
                    new Discord.MessageEmbed()
                    .setTitle(`Tic Tac Toe`)
                    .setColor('#b00b1e')
                    .setDescription(`${message.member} vs. ${member}`)
                    .addField('Game Board', tic.game.visualize())
                  ],
                  components: []
                })
              }
              else{
                m.edit({
                  content: `The buttons will no longer work, so they have been removed. You can still continue the game using the \`${prefix}move\` command!`,
                  embeds: [
                    new Discord.MessageEmbed()
                    .setTitle(`Tic Tac Toe`)
                    .setColor('#b00b1e')
                    .setDescription(`${message.member} vs. ${member}`)
                    .addField('Game Board', tic.game.visualize())
                  ],
                  components: []
                })
              }
            })
          })
        }else{
          col.stop('Decline')
        }
      })
      col.on('end', (c, r) => {
        if(r == 'time'){
          m.edit({
            embeds: [
              new Discord.MessageEmbed()
              .setTitle('Game Timed Out!')
              .setColor('#b00b1e')
              .setDescription(`${member.user.tag} did not respond in the allotted 60 seconds!`)
            ],
            components: []
          })
        }else{
          m.edit({
            embeds: [
              new Discord.MessageEmbed()
              .setTitle('Challenge Declined!')
              .setColor('#b00b1e')
              .setDescription(`${member.user.tag} has declined your challenge!`)
            ],
            components: []
          })
        }
      })
    })
  }

  if(cmd === 'move' || cmd == 'm'){
    mov(message, {user:{id:message.author.id}}, args, games)
  }

  if(cmd === 'end'){
    if(!games.has(`${message.author.id}`)){
      return message.channel.send('You are not in a game')
    }
    let p = games.get(`${message.author.id}`)
    let tic = gameStates.get(p.gameId)
    games.delete(`${tic.xPlayer[0]}`)
    games.delete(`${tic.oPlayer[0]}`)
    tic.game.moveLog.push(`${message.author.username} ended the game!`)
    message.channel.send({
      embeds: [
        new Discord.MessageEmbed()
        .setTitle(`Game Ended by ${message.author.username}`)
        .setColor('#b00b1e')
        .setDescription(`${message.guild.members.cache.get(tic.xPlayer[0])} vs. ${message.guild.members.cache.get(tic.oPlayer[0])}`)
        .addField('Game Board', tic.game.visualize())
        .addField('Movelog', tic.game.moveLog.join('\n'))
      ]
    })
  }

  if(cmd === 'board'){
    if(!games.has(`${message.author.id}`)){
      return message.channel.send('You are not in a game')
    }
    let p = games.get(`${message.author.id}`)
    let tic = gameStates.get(p.gameId)

    message.channel.send({
      embeds: [
        new Discord.MessageEmbed()
        .setTitle(`Tic Tac Toe`)
        .setColor('#b00b1e')
        .setDescription(`${message.guild.members.cache.get(tic.xPlayer[0])} vs. ${message.guild.members.cache.get(tic.oPlayer[0])}`)
        .addField('Game Board', tic.game.visualize())
      ]
    })
  }

  if(cmd === 'how'){
    message.channel.send({
      embeds: [
        new Discord.MessageEmbed()
        .setTitle('How to play Tic Tac Toe')
        .setColor('#b00b1e')
        .setDescription(`Tic Tac Toe is played on a 3x3 grid of squares:\n\` \` 1️⃣ 2️⃣ 3️⃣\n\`A\` ⬛|⬛|⬛\n\`B\` ⬛|⬛|⬛\n\`C\` ⬛|⬛|⬛\n\nOne player is an x, and one player is an o. Both of you compete to have three letter in a row before the other player. You take turns by putting your letter in an empty square.\n\nWhen all 9 squares are occupied, the game is over. If neither player has three of their letters in a row, the game is a draw.`)
      ]
    })
  }

  if(cmd == 'invite'){
    message.channel.send({
      embeds: [
        new Discord.MessageEmbed()
        .setTitle('Tic Tac Toe Bot Invite')
        .setColor('#b00b1e')
        .setDescription('Invite the bot using [this link!](https://discord.com/api/oauth2/authorize?client_id=762833969183326228&permissions=2048&scope=bot%20applications.commands)\n[Join the Impassive Development Support Server](https://discord.com/invite/mZpSX5y9Mp)')
      ]
    })
  }

  if(cmd == 'stats'){
    let option = args[0]
    let ready = new Date(bot.readyTimestamp)
    let readystring = `${ready.getMonth()}/${ready.getDate()}/${ready.getFullYear()} at ${ready.getHours()}:${ready.getMinutes()}`
    if(!option){
      let dependencies = []
      for(var i in Object.keys(package.dependencies)){
        dependencies.push(`${Object.keys(package.dependencies)[i]}@${package.dependencies[Object.keys(package.dependencies)[i]]}`)
      }
      message.channel.send({
        embeds: [
          new Discord.MessageEmbed()
          .setTitle("Tic-Tac-Toe Stats")
          .setColor('#b00b1e')
          .setDescription(`Uptime - ${toHMS(Date.now()-bot.readyTimestamp)}`)
          .addField('Ready Since', readystring)
          .addField('Message Ping', `${message.createdTimestamp - Date.now()}ms`)
          .addField('API Ping', `${Math.round(bot.ws.ping)}ms`)
          .addField('Code Version', `v${package.version}`)
          .addField('Dependencies', dependencies.join('\n'))
          .setFooter(`For only one field, do ${prefix}stats {option}`)
        ]
      })
    }else if(option.toLowerCase() == 'uptime'){
      message.channel.send({
        embeds: [
          new Discord.MessageEmbed()
          .setTitle('Uptime')
          .setColor('#b00b1e')
          .setDescription(`**Ready Since**\n${readystring}\n**Uptme**\n${toHMS(Date.now()-bot.readyTimestamp)}`)
        ]
      })
    }else if(option.toLowerCase() == 'ping'){
      message.channel.send({
        embeds: [
          new Discord.MessageEmbed()
          .setTitle('Latency')
          .setColor('#b00b1e')
          .setDescription(`**Message Ping**\n${message.createdTimestamp -  Date.now()}ms\n**API Ping**\n${Math.round(bot.ws.ping)}ms`)
        ]
      })
    }else if(option.toLowerCase() == 'development'){
      let dependencies = []
      for(var i in Object.keys(package.dependencies)){
        dependencies.push(`${Object.keys(package.dependencies)[i]}@${package.dependencies[Object.keys(package.dependencies)[i]]}`)
      }
      message.channel.send({
        embeds: [
          new Discord.MessageEmbed()
          .setTitle('Development Information')
          .setColor('#b00b1e')
          .setDescription(`**Code Version**\nv${package.version}\n**Dependencies**\n${dependencies.join('\n')}`)
        ]
      })
    }
  }

  if(cmd == 'setprefix'){
    if(!message.member.permissions.has('MANAGE_GUILD')){
      message.channel.send({
        content: "You must have `MANAGE_GUILD` permissions to edit the prefix!"
      })
      return
    }
    if(!args[0]){
      let prefix = 't!'
      db[message.guild.id].prefix = prefix
      fs.writeFileSync('./database.json', JSON.stringify(db))
      message.channel.send({
        content: "The bot prefix has been restored to default(`t!`)"
      })
    }else{
      let prefix = args[0].toLowerCase()
      db[message.guild.id].prefix = prefix
      fs.writeFileSync('./database.json', JSON.stringify(db))
      message.channel.send({
        content: `The bot prefix has been set to \`${prefix}\``
      })
    }
  }

  if(cmd == 'profile'){
    let me = db[message.author.id]
    let embed = new Discord.MessageEmbed()
    .setTitle(`${message.author.tag}'s Profile`)
    .setColor("#b00b1e")
    .addField("Wins", me.wins.toString())
    .addField("Losses", me.losses.toString())
    .addField("Draws", me.draws.toString())

    message.channel.send({
      embeds: [embed]
    })
  }
})

bot.login(process.env.TOKEN)