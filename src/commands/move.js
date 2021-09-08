const Discord = require('discord.js')
const move = require('../globalfuncs/move')

module.exports = {
    name: 'move',
    permission: 'SEND_MESSAGES',
    slash: {
        name: 'move',
        description: 'Take your turn in a game',
        dafaultPermission: true,
        options: [
            {
                name: 'move',
                description: 'The board square to make your move',
                type: 'STRING',
                required: true,
                choices: [
                    {name: "A1", value: "A1"},
                    {name: "A2", value: "A2"},
                    {name: "A3", value: "A3"},
                    {name: "B1", value: "B1"},
                    {name: "B2", value: "B2"},
                    {name: "B3", value: "B3"},
                    {name: "C1", value: "C1"},
                    {name: "C2", value: "C2"},
                    {name: "C3", value: "C3"}
                ]
            }
        ]
    },
    execute(bot, i, games, gamestates){
        move(i, false, games, gamestates)
    }
}