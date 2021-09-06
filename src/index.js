require('dotenv').config()
const Discord = require('discord.js')
const nano = require('tic-tac-nano-2')
const package = require('../package.json')
const fs = require('fs')

const Games = new Map()
const GameStates = new Map()
var Num = 0;

const bot = new Discord.Client({
    intents: new Discord.Intents(4659),
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})
bot.commands = new Discord.Collection()

bot.on('ready', () => {
    console.log('Initiating Commands')

    const folder = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))
    for(var i = 0; i<folder.length; i++){
        let command = require('./commands/'+folder[i])
        let commands = require('../commands.json')
        if(commands.includes(command.name)){
            console.log(command.name+" is already registered. Skipping to next command.")
        }else{
            commands.push(command.name)
            bot.guilds.cache.get(process.env.TEST_GUILD).commands.create(command.slash)
            fs.writeFileSync('./commands.json', JSON.stringify(commands))
            console.log(command.name+" successfully registered!")
        }
        bot.commands.set(command.name, command)
    }

    let data = require('../data.json')
    bot.guilds.cache.forEach(g => {
        g.members.cache.forEach(u => {
            if(!data[u.id]){
                data[u.id] = {
                    wins: 0,
                    losses: 0,
                    draws: 0
                }
            }
        })
    })
    fs.writeFileSync('./data.json', JSON.stringify(data))
    console.log('Users Cached!')
    console.log('Initiation Complete')
})

bot.on('interactionCreate', (i) => {
    if(i.isCommand() || i.isContextMenu()){
        let command = bot.commands.get(i.commandName)
        if(!command) return i.reply({content: 'That command is not set up yet!', ephemeral: true})
        else return command.execute(bot, i, Games, GameStates)
    }
})

bot.login(process.env.TOKEN)