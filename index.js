const Discord = require('discord.js')
const nano = require('tic-tac-nano-2')


var game = false;
var tic;
var xPlayer,oPlayer;
var turnPlayer;

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

const bot = new Discord.Client()

bot.on('ready', async () => {
  console.log(`Logged in as ${bot.user.tag} in ${bot.guilds.cache.size} servers`)
})

bot.on('message', async message => {
  let prefix = '/';
  let arr = message.content.split(' ')
  let cmd = arr[0];
  let args = arr.slice(1)
  if(!cmd.startsWith(prefix)) return;
  cmd = cmd.toLowerCase().split('').slice(prefix.length).join('')

  if(cmd === 'help'){
    message.channel.send(
      new Discord.MessageEmbed()
      .setTitle('Tic Tac Toe')
      .setDescription(`
      **${prefix}help** - Show this embed
      **${prefix}game <member>** - Start a game with another member
      **${prefix}move <square>** - Take your turn in the game
      **${prefix}say <something>** - Make the bot say something
      **${prefix}how** - Show a basic how to play
      `)
    )
  }

  if(cmd === 'game'){
    let member = message.mentions.members.first() || message.guild.membes.cache.get(args[0])
    if(!member) return;
    if(game === true){
      return message.channel.send('There is already a game going on')
    }else{
      game = true;
      let x = args[1] || '❌';
      let o = args[2] || '⭕';
      tic = new nano(message.member.user.username, member.user.username, x, o, '⬛')
      xPlayer = [message.author.id, 'x'];
      oPlayer = [member.id, 'o']
      turnPlayer = xPlayer;
      message.channel.send(new Discord.MessageEmbed()
      .setTitle(`Tic Tac Toe`)
      .setDescription(`
      ${message.member.user.username} vs. ${member.user.username}
      ${tic.visualize()}
      `)
      )
    }
  }

  if(cmd === 'move'){
    let move = args[0];
    if(game === false){
      return message.channel.send('There is no game going on')
    }
    if(!args[0]){
      return message.channel.send('You must specify a move')
    }
    let mo = move.toUpperCase();
    console.log(mo);
    if(!validMoves.has(mo)){
      return message.channel.send('That is not a valid tic tac toe board square')
    }
    if(message.author.id != turnPlayer[0]){
      return message.channel.send('It is not your turn')
    }else{
      let a = tic.turn(move, turnPlayer[1])
      if(a === false){
        return message.channel.send('Invalid Move')
      }else{
        message.channel.send(new Discord.MessageEmbed()
          .setTitle(`Tic Tac Toe`)
          .setDescription(`
          ${message.guild.members.cache.get(xPlayer[0])} vs. ${message.guild.members.cache.get(oPlayer[0])}
          ${tic.visualize()}
          `)
        )
        if(tic.didWin() != false){
          message.channel.send(tic.didWin()+'\n***Game Movelog***\n'+tic.moveLog.join('\n'))
          game = false;
          xPlayer = null;
          oPlayer = null;
          turnPlayer = null;
          tic = null;
        //Turns out, I forgot to put the draw condition smh
        }else if(tic.board.A1!='' && tic.board.A2!='' && tic.board.A3!='' && tic.board.B1!='' && tic.board.B2!='' && tic.board.B3!='' && tic.board.C1!='' && tic.board.C2!='' && tic.board.C3!=''){
          message.channel.send('No Winner'+'\n***Game Movelog***\n'+tic.moveLog.join('\n'))
          game = false;
          xPlayer = null;
          oPlayer = null;
          turnPlayer = null;
          tic = null;
        }else{
          if(turnPlayer === xPlayer){
            turnPlayer = oPlayer
          }else{
            turnPlayer = xPlayer
          }
        }
      }
    }
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
      .setDescription(`
      Tic Tac Toe is played on a 3x3 grid of squares:
      \` \` 1️⃣ 2️⃣ 3️⃣
      \`A\` ⬛|⬛|⬛
      \`B\` ⬛|⬛|⬛
      \`C\` ⬛|⬛|⬛

      One player is an x, and one player is an o. Both of you compete to have three letter in a row before the other player. You take turns by putting your letter in an empty square.

      When all 9 squares are occupied, the game is over. If neither player has three of their letters in a row, the game is a draw.
      `)
    )
  }

bot.login('TOKEN')
