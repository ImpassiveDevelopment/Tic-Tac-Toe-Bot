const Discord = require('discord.js')
const nano = require('tic-tac-nano-2')
const fs = require('fs');
const DBL = require("dblapi.js");
const package = require('./package.json')


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

const bot = new Discord.Client({fetchAllMembers: true})

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
		name: `For t!help in ${bot.guilds.cache.size} servers`
	})
  setInterval(() => {
    bot.user.setActivity({
      type: 'WATCHING',
      name: `For t!help in ${bot.guilds.cache.size} servers`
    })
  }, 60000)
})

bot.on('message', async message => {
  let prefix = 't!';
  let arr = message.content.split(' ')
  let cmd = arr[0];
  let args = arr.slice(1)
  if(!cmd.startsWith(prefix)) return;
  cmd = cmd.toLowerCase().split('').slice(prefix.length).join('')

  if(cmd === 'help'){
    message.channel.send(
      new Discord.MessageEmbed()
      .setTitle('Tic Tac Toe')
      .setColor('#b00b1e')
      .addField(`${prefix}help`, 'View the help embed')
      .addField(`${prefix}game <member>`, "Start a game with the selected memeber\n**Member** - The ID or mention of a member")
      .addField(`${prefix}move <square>`, "Take your turne\n**Square** - A valid space on the board")
      .addField(`${prefix}end`, "End your current game")
      .addField(`${prefix}board`, "View your current game's board")
      .addField(`${prefix}say <something>`, '*Requires bot and executor to have `MANAGE_MESSAGES` permission*\nHave the bot repeat the message you sent\n**Something** - Any text')
      .addField(`${prefix}how`, "Get a small how-to of tic-tac-toe")
      .addField(`${prefix}invite`, "Get the bot invite link")
      .addField(`${prefix}stats {options}`, "View some stats on the bot\n**Options** - Focus on one area, uptime, ping, or development")
      .setDescription("Want to support development? [Upote the bot on top.gg](https://top.gg/bot/762833969183326228/vote)")
      .setFooter('<> - Required Arguments || {} - Optional Arguments')
    )
  }

  if(cmd === 'game'){
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
    if(!member) return;
    if(games.has(`${message.author.id}`)){
      return message.channel.send('You are already in a game')
    }
    if(games.has(`${member.id}`)){
      return message.channel.send('The tagged person is in a game')
    }
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
    message.channel.send(
      new Discord.MessageEmbed()
      .setTitle(`Tic Tac Toe`)
      .setColor('#b00b1e')
      .setDescription(`${message.member} vs. ${member}`)
      .addField('Game Board', tic.game.visualize())
    )
  }

  if(cmd === 'move'){
    let move = args[0];
    if(!games.has(`${message.author.id}`)){
      return message.channel.send('You are not in a game!')
    }
    if(!args[0]){
      return message.channel.send('You must specify a move')
    }
    move = move.split('')
    move[0] = move[0].toUpperCase()
    let mo = move.join('')

    if(!validMoves.has(mo)){
      return message.channel.send('That is not a valid tic tac toe board square')
    }
    let player = games.get(`${message.author.id}`);
    let tic = gameStates.get(player.gameId)
    if(message.author.id != tic.turnPlayer[0]){
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
        .addField('Game Board', tic.game.visualize())
        if(tic.game.didWin() != false && tic.game.didWin() != 'No one Wins'){
          embed.addField('Movelog', tic.game.moveLog.join('\n'))
          games.delete(tic.xPlayer[0])
          games.delete(tic.oPlayer[0])
        //Turns out, I forgot to put the draw condition smh
        }else if(tic.game.board.A1!='' && tic.game.board.A2!='' && tic.game.board.A3!='' && tic.game.board.B1!='' && tic.game.board.B2!='' && tic.game.board.B3!='' && tic.game.board.C1!='' && tic.game.board.C2!='' && tic.game.board.C3!=''){
          embed.addField('No Winner - Movelog', tic.game.moveLog.join('\n'))
          games.delete(tic.xPlayer[0])
          games.delete(tic.oPlayer[0])
        }else{
          if(tic.turnPlayer === tic.xPlayer){
            tic.turnPlayer = tic.oPlayer
          }else{
            tic.turnPlayer = tic.xPlayer
          }
        }
        message.channel.send(embed)
      }
    }
  }

  if(cmd === 'end'){
    if(!games.has(`${message.author.id}`)){
      return message.channel.send('You are not in a game')
    }
    let p = games.get(`${message.author.id}`)
    let tic = gameStates.get(p.gameId)
    games.delete(`${tic.xPlayer[0]}`)
    games.delete(`${tic.oPlayer[0]}`)
    message.channel.send(
      new Discord.MessageEmbed()
      .setTitle(`Game Ended by ${message.author.username}`)
      .setColor('#b00b1e')
      .setDescription(`${message.guild.members.cache.get(tic.xPlayer[0])} vs. ${message.guild.members.cache.get(tic.oPlayer[0])}`)
      .addField('Game Board', tic.game.visualize())
      .addField('Movelog', tic.game.moveLog.join('\n'))
    )
  }

  if(cmd === 'board'){
    if(!games.has(`${message.author.id}`)){
      return message.channel.send('You are not in a game')
    }
    let p = games.get(`${message.author.id}`)
    let tic = gameStates.get(p.gameId)

    message.channel.send(
      new Discord.MessageEmbed()
      .setTitle(`Tic Tac Toe`)
      .setColor('#b00b1e')
      .setDescription(`${message.guild.members.cache.get(tic.xPlayer[0])} vs. ${message.guild.members.cache.get(tic.oPlayer[0])}`)
      .addField('Game Board', tic.game.visualize())
    )
  }

  if(cmd === 'say'){
    if(!message.member.hasPermission('MANAGE_MESSAGES')){
      return message.channel.send('You must have permission to manage messages to use this command')
    }else{
      return message.channel.send(args.join(' '))
    }
  }

  if(cmd === 'how'){
    message.channel.send(
      new Discord.MessageEmbed()
      .setTitle('How to play Tic Tac Toe')
      .setColor('#b00b1e')
      .setDescription(`Tic Tac Toe is played on a 3x3 grid of squares:\n\` \` 1️⃣ 2️⃣ 3️⃣\n\`A\` ⬛|⬛|⬛\n\`B\` ⬛|⬛|⬛\n\`C\` ⬛|⬛|⬛\n\nOne player is an x, and one player is an o. Both of you compete to have three letter in a row before the other player. You take turns by putting your letter in an empty square.\n\nWhen all 9 squares are occupied, the game is over. If neither player has three of their letters in a row, the game is a draw.`)
    )
  }

  if(cmd == 'invite'){
    message.channel.send(
      new Discord.MessageEmbed()
      .setTitle('Tic Tac Toe Bot Invite')
      .setColor('#b00b1e')
      .setDescription('Invite the bot using [this link!](https://discord.com/api/oauth2/authorize?client_id=762833969183326228&permissions=2048&scope=bot)')
    )
  }

  if(cmd == 'stats'){
    let option = args[0]
    if(!option){
      let dependencies = []
      for(var i in Object.keys(package.dependencies)){
        dependencies.push(`${Object.keys(package.dependencies)[i]}@${package.dependencies[Object.keys(package.dependencies)[i]]}`)
      }
      message.channel.send(
        new Discord.MessageEmbed()
        .setTitle("Tic-Tac-Toe Stats")
        .setColor('#b00b1e')
        .setDescription(`Uptime - ${toHMS(Date.now()-bot.readyTimestamp)}`)
        .addField('Ready Since', bot.readyAt)
        .addField('Message Ping', `${message.createdTimestamp - Date.now()}ms`)
        .addField('API Ping', `${Math.round(bot.ws.ping)}ms`)
        .addField('Code Version', `v${package.version}`)
        .addField('Dependencies', dependencies.join('\n'))
        .setFooter(`For only one field, do ${prefix}stats {option}`)
      )
    }else if(option.toLowerCase() == 'uptime'){
      message.channel.send(
        new Discord.MessageEmbed()
        .setTitle('Uptime')
        .setColor('#b00b1e')
        .setDescription(`**Ready Since**\n${bot.readyAt}\n**Uptme**\n${toHMS(Date.now()-bot.readyTimestamp)}`)
      )
    }else if(option.toLowerCase() == 'ping'){
      message.channel.send(
        new Discord.MessageEmbed()
        .setTitle('Latency')
        .setColor('#b00b1e')
        .setDescription(`**Message Ping**\n${message.createdTimestamp -  Date.now()}ms\n**API Ping**\n${Math.round(bot.ws.ping)}ms`)
      )
    }else if(option.toLowerCase() == 'development'){
      let dependencies = []
      for(var i in Object.keys(package.dependencies)){
        dependencies.push(`${Object.keys(package.dependencies)[i]}@${package.dependencies[Object.keys(package.dependencies)[i]]}`)
      }
      message.channel.send(
        new Discord.MessageEmbed()
        .setTitle('Development Information')
        .setColor('#b00b1e')
        .setDescription(`**Code Version**\nv${package.version}\n**Dependencies**\n${dependencies.join('\n')}`)
      )
    }
  }
})

bot.login('TOKEN')