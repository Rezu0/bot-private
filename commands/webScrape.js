const { SlashCommandBuilder } = require('discord.js')
const xray = require('x-ray')
var x = xray()

module.exports = {
    data: new SlashCommandBuilder()
        .setName('web-scrape')
        .setDescription('Scrape website orang')
        .addStringOption(option => option.setName('url').setDescription('Masukan URL')),
        async execute(interaction){
            const url = await interaction.options.getString('url')

            x('https://samehadaku.run/', '.post-show')(function(err, title) {
                console.log(title)
            })
            
            // x('https://samehadaku.run/', '.post-show', [
            // {
            //     title: 'h2 a',
            //     link: '.article-title@href'
            // }
            // ])
            // .paginate('.nav-previous a@href')
            // .limit(3)
            // .write('results.json')
        }
}
