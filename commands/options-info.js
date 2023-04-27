const { SlashCommandBuilder, EmbedBuilder } = require('discord.js')
require('axios')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Semua tentang Command bot ini...'),
        async execute(interaction){
            
        }
}