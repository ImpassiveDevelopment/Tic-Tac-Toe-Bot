require('dotenv').config()
const Discord = require('discord.js')
const nano = require('tic-tac-nano-2')
const package = require('../package.json')
const fs = require('fs')
const express = require('express')

const Topgg = require('@top-gg/sdk')
const API = new Topgg.Api(process.env.TOPGG)

const Games = new Map()
const GameStates = new Map()
var Num = 0;

const bot = new Discord.Client({
    intents: new Discord.Intents(515),
    partials: ['MESSAGE', 'CHANNEL', 'REACTION']
})
bot.commands = new Discord.Collection()


bot.on('ready', async () => {
    const app = express()
    console.log('Initiating Commands')

    bot.user.setActivity({
        name: `/help in ${bot.guilds.cache.size} Servers`,
        type: 'PLAYING'
    })

    const folder = fs.readdirSync('./src/commands').filter(file => file.endsWith('.js'))
    for(var i = 0; i<folder.length; i++){
        let command = require('./commands/'+folder[i])
        let commands = require('../commands.json')
        if(commands.includes(command.name)){
            console.log(command.name+" is already registered. Skipping to next command.")
        }else{
            commands.push(command.name)
            if(command.slash.defaultPermission == false){
                let com = await bot.guilds.cache.get(process.env.OS).commands.create(command.slash)
                com.permissions.add({
                    permissions: [
                        {
                            id: process.env.OWNER,
                            type: 'USER',
                            permission: true
                        }
                    ]
                })
            }else{
                bot.application.commands.create(command.slash)
            }
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

    await API.postStats({
        serverCount: bot.guilds.cache.size,
        shardCount: 1
    })
})

bot.on('interactionCreate', (i) => {
    if(i.isCommand() || i.isContextMenu()){
        let command = bot.commands.get(i.commandName)
        if(!command) return i.reply({content: 'That command is not set up yet!', ephemeral: true})
        else return command.execute(bot, i, Games, GameStates)
    }
})

bot.on('guildCreate', async guild => {
    let db = require('../data.json')
    guild.members.cache.forEach(m => {
        if(!db[m.id]){
            db[m.id] = {
                wins: 0,
                losses: 0,
                draws: 0
            }
        }
    })
    bot.user.setActivity({
        name: `/help in ${bot.guilds.cache.size} Servers`,
        type: 'PLAYING'
    })
    fs.writeFileSync('./data.json', JSON.stringify(db))
    bot.channels.cache.get(process.env.SERVER_LOGS).send({
        embeds: [
            new Discord.MessageEmbed()
            .setTitle("Guild Added!")
            .setColor('#b00b1e')
            .setDescription(`I have been added to the guild \`${guild.name}\`!\nServer Count - ${bot.guilds.cache.size}`)
        ]
    })

    await API.postStats({
        serverCount: bot.guilds.cache.size,
        shardCount: 1
    })
})

bot.on('guildDelete', async guild => {
    bot.user.setActivity({
        name: `/help in ${bot.guilds.cache.size} Servers`,
        type: 'PLAYING'
    })
    bot.channels.cache.get(process.env.SERVER_LOGS).send({
        embeds: [
            new Discord.MessageEmbed()
            .setTitle("Guild Removed!")
            .setColor('#b00b1e')
            .setDescription(`I have been removed from the guild \`${guild.name}\`!\nServer Count - ${bot.guilds.cache.size}`)
        ]
    })

    await API.postStats({
        serverCount: bot.guilds.cache.size,
        shardCount: 1
    })
})

bot.login(process.env.TOKEN)