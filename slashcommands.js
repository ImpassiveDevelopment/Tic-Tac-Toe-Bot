module.exports = {
    initiate: (bot) => {
        bot.application.commands.create({
            name: 'help',
            description: 'View the help embed'
        })
        bot.application.commands.create({
            name: 'how',
            description: 'Learn how to play tic-tac-toe'
        })
        bot.application.commands.create({
            name: 'invite',
            description: 'Get the bot\'s invite link'
        })
        bot.application.commands.create({
            name: 'stats',
            description: 'View various statistics on the bot',
            options: [{
                name: 'options',
                description: 'Which area of statistics you want to view',
                type: "STRING",
                required: false,
                choices: [
                    {name: 'uptime', value: 'uptime'},{name: 'ping', value: 'ping'},{name: 'development', value: 'development'}
                ]
            }]
        })
        bot.application.commands.create({
            name: 'prefix',
            description: 'See the bot\'s prefix in the server'
        })
        bot.application.commands.create({
            name: 'profile',
            description: 'See your own or someone else\'s profile',
            options: [{
                name: 'target',
                type: 'USER',
                description: 'The person who\'s profile you want to view',
                required: false
            }]
        })
        bot.application.commands.create({
            name: 'move',
            description: "Make a move on the game you are currently playing",
            options: [{
                name: 'square',
                type: 'STRING',
                description: 'The board square you want to move to',
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
                    {name: "C3", value: "C3"},
                ]
            }]
        })
    }
}