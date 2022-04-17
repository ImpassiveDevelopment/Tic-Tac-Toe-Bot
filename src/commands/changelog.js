const Discord = require('discord.js')

const embeds = {
    '3.1.1': new Discord.MessageEmbed()
    .setTitle('v3.1.1')
    .setColor('#b00b1e')
    .setDescription('- Made "ready" event async\n- Added Top.gg stat posting'),
    '3.1.2': new Discord.MessageEmbed()
    .setTitle('v3.1.2')
    .setColor('#b00b1e')
    .setDescription('- Made "guildCreate" and "guildDelete" async\n- Added changelog to README'),
    '3.2.0': new Discord.MessageEmbed()
    .setTitle('v3.2.0')
    .setColor('#b00b1e')
    .setDescription('- Added "changelog" command\n- Added bot owner "refresh" command\n- Reworked command registration a tad bit'),
    '3.3.0': new Discord.MessageEmbed()
    .setTitle('v3.3.0')
    .setColor("#b00b1e")
    .setDescription('**October 19, 2021**\n- Added command error handling\n- Added admin debug portal'),
    '3.3.1': new Discord.MessageEmbed()
    .setTitle("v3.3.1")
    .setColor("#b00b1e")
    .setDescription('**April 17, 2022**\n- Removed `profile` command, and removed logging for wins/loss/draws\n- Updated changelog command\n- Removed debug webserver\n- Made the bot setup a bash executable file')
}

module.exports = {
    name: 'changelog',
    permission: 'SEND_MESSAGES',
    slash: {
        name: 'changelog',
        description: 'View the changelog for the bot',
        dafaultPermission: true,
        options: [{
            name: 'version',
            description: 'The version you want to see the changes for',
            required: false,
            type: 'STRING',
            choices: [
                {name: 'v3.1.1', value: '3.1.1'},
                {name: 'v3.1.2', value: '3.1.2'},
                {name: 'v3.2.0', value: '3.2.0'},
                {name: 'v3.3.0', value: '3.3.0'},
                {name: 'v3.3.1', value: '3.3.1'}
            ]
        }]
    },
    execute(bot, i){
        let option = i.options.get('version')
        if(option){
            i.reply({
                embeds: [
                    embeds[option.value]
                ]
            })
        }
        if(!option){
            const row = new Discord.MessageActionRow()
            .addComponents([
                new Discord.MessageSelectMenu()
                .setCustomId('version')
                .setPlaceholder('v3.1.1')
                .addOptions([
                    {
                        label: 'v3.1.1',
                        description: 'Release 3.1.1',
                        value: '3.1.1'
                    },
                    {
                        label: 'v3.1.2',
                        description: 'Release 3.1.2',
                        value: '3.1.2'
                    },
                    {
                        label: 'v3.2.0',
                        description: 'Release 3.2.0',
                        value: '3.2.0'
                    },
                    {
                        label: 'v3.3.0',
                        description: 'Release 3.3.0',
                        value: '3.3.0'
                    },
                    {
                        label: 'v3.3.1',
                        description: 'Release 3.3.1',
                        value: '3.3.1'
                    }
                ])
            ])
            i.reply({content: 'Changelog Initiated!', ephemeral: true})
            i.channel.send({
                embeds: [
                    embeds['3.1.1']
                ],
                components: [
                    row
                ]
            }).then(message => {
                const filter = (c) => c.user === i.user
                const collector = message.createMessageComponentCollector({filter, type: 'SELECT_MENU', time: 90000})
                collector.on('collect', (interaction) => {
                    interaction.deferUpdate()
                    row.components[0].setPlaceholder("v"+ interaction.values[0])
                    message.edit({
                        embeds: [
                            embeds[interaction.values[0]]
                        ],
                        components: [
                            row
                        ]
                    })
                })
                collector.on('end', (c) => {
                    message.edit({
                        components: []
                    })
                })
            })
        }
    }
}