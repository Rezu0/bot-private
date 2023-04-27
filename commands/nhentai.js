const { SlashCommandBuilder, EmbedBuilder, time, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js')
const { default: axios } = require('axios')
require('dotenv/config')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dev-nhentai')
        .setDescription('Description for Doujin')
        .addStringOption(option =>
                option.setName('kode-nuklir')
                    .setDescription('Masukan Kode Nuklir mu disini!')
            )
        .setDMPermission(true),
        async execute(interaction, client){

            var artisArr = [],
                indexTag = {},
                genreArr = [],
                langArr = [];
            
            return await interaction.reply('coming soon... tunggu dalam 1 minggu atau lebih jika tidak malas mengerjakan')
            var kode = await interaction.options.getString('kode-nuklir')

            if(!Number.isNaN(+kode)){
                const config = {
                    method: 'get',
                    maxBodyLength: Infinity,
                    url: process.env.BASE_NHEN_URL + kode,
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    }
                }
    
                // await interaction.deferReply()
                axios(config).then(async function(res){
                    for (let i = 0; i < res.data.tags.length; i++) {
                        artisArr.push(res.data.tags[i].type)
                    }

                    artisArr.forEach(function(x){
                        indexTag[x] = (indexTag[x] || 0) + 1
                    })

                    var startLooping = indexTag.language + indexTag.parody + indexTag.group + indexTag.artist
                    var indexArtis = artisArr.indexOf('artist')
                    var data = res.data
                    var newDate = new Date();
                    newDate.setTime(res.data.upload_date * 1000);
                    dateString = newDate.toUTCString();

                    const embedPageOne = new EmbedBuilder   ()
                        .setColor('F15478')
                        .setTitle(`**${data.title.pretty}**`)
                        .setURL(process.env.BASE_NHEN_REDIRECT + data.id)
                        .setAuthor({
                            name: res.data.tags[indexArtis].name,
                            url: process.env.BASE_NHEN_DEFAULT + res.data.tags[indexArtis].url
                        })
                        .setImage(`${process.env.BASE_NHEN_GALERRIES}${data.media_id}/thumb.jpg`)
                        .setDescription(`**Uploaded:** ${dateString}`)
                        .setFooter(
                            {
                                text: `Total ${res.data.num_pages} pages`
                            }
                        )
                            
                    for (let a = startLooping; a < indexTag.tag; a++) {
                        genreArr.push(res.data.tags[a].name)
                    }

                    for (let b = 0; b < indexTag.language; b++) {
                        langArr.push(res.data.tags[b].name)
                    }

                    embedPageOne.setFields(
                        {
                            name: '**Language**',
                            value: langArr.join(' | '),
                            inline: true
                        },
                        {
                            name: '**Genres**',
                            value: genreArr.join(' | '),
                            inline: true
                        },
                        {
                            name: '\u200B', value: '\u200B'
                        },
                        {
                            name: '**Parody**',
                            value: (res.data.tags[indexTag.language].name) ? res.data.tags[indexTag.language].name : 'null',
                            inline: true
                        },
                        {
                            name: '**Group**',
                            value: (res.data.tags[indexTag.language + indexTag.parody].name) ? res.data.tags[indexTag.language + indexTag.parody].name : 'null',
                            inline: true
                        },
                        {
                            name: '**Category**',
                            value: (res.data.tags[indexTag.language + indexTag.parody + indexTag.group + indexTag.artist + indexTag.tag].name) ? res.data.tags[indexTag.language + indexTag.parody + indexTag.group + indexTag.artist + indexTag.tag].name : 'null',
                            inline: true

                        },
                        {
                            name: '\u200B', value: '\u200B'
                        },
                        {
                            name: '**All Title**',
                            value: `**English:** ${(res.data.title.english) ? res.data.title.english : 'null'} \n\n**Japanese:** ${(res.data.title.japanese) ? res.data.title.japanese : 'null'} \n\n**Pretty:** ${(res.data.title.pretty) ? res.data.title.pretty : 'null'}`
                        },
                    )
                
                    const buttonNext = new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('buttonPrev')
                                .setLabel('Prev')
                                .setStyle(ButtonStyle.Secondary),
                            new ButtonBuilder()
                                .setCustomId('buttonNext')
                                .setLabel('Next')
                                .setStyle(ButtonStyle.Primary),
                            
                        )
        
                    // const embed = new EmbedBuilder()
                    //         .setColor('Random')
                    //         .setDescription(`${interaction.user.tag} button!`)
        
                    // const embed2 = new EmbedBuilder()
                    //         .setColor('Random')
                    //         .setDescription(`${kode} button`)
        
                    await interaction.reply({
                        embeds: [embedPageOne],
                        // components: [buttonNext]
                    })
        
                    // const collector = interaction.channel.createMessageComponentCollector()
        
                    // collector.on('collect', async i => {
                    //     console.log(i.user.id);
                    //     if(i.customId == 'buttonPrev'){
                    //         buttonNext.components[0].setDisabled(true)
                    //         await i.update({ embeds: [embed], components: [buttonNext] }).catch(err => {
                    //             interaction.reply({
                    //                 content: 'Maaf coba lagi...',
                    //                 ephemeral: true
                    //             })
                    //         });
        
                    //     }else{
                    //         await i.update({ embeds: [embed2], components: [buttonNext] }).catch(err => {
                    //             interaction.reply({
                    //                 content: 'Maaf coba lagi...',
                    //                 ephemeral: true
                    //             })
                    //         });
                    //     }
                    //     console.log(i.customId);
                    // });
        
                    // collector.on('end', collected => console.log(`Collected ${collected.size} items`));

                }).catch(async function(error){
                    await interaction.channel.send('Something went wrong! (ada yang salah antara Language, Genres, Parody, Group, Category')
                    console.log(error);
                })
                
            }else{
                return await interaction.reply('Please enter a number!')
            }

        }
}