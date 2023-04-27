const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, time  } = require('discord.js')
const Tesseract = require('tesseract.js')
const scraper = require('website-scraper-2')
require('axios')

const ocrScan = async (image, lang, interaction) => {
    await interaction.deferReply()
    Tesseract.recognize(
        image,
        lang,
        { logger: async m => await interaction.editReply(m.status) }
    ).then(async ({ data: { text } }) => {
        await interaction.editReply(text)
    })
}

const langOpt = (codeLang) => {
    switch (true) {
        case (codeLang == 'eng'):
            return 'English'
            break;
        case (codeLang == 'ind'):
            return 'Indonesia'
            break;
        case (codeLang == 'jpn'):
            return 'Japan'
            break;
        case (codeLang == 'kor'):
            return 'Korea'
            break;
        case (codeLang == 'ara'):
            return 'Arabic'
            break;
        case (codeLang == 'spa'):
            return 'Spanish Modern'
            break;
        case (codeLang == 'spa_old'):
            return 'Spanish Old'
            break;
        case (codeLang == 'rus'):
            return 'Russian'
            break;
        case (codeLang == 'chi_sim'):
            return 'Chinese - Simplified'
            break;
        case (codeLang == ('jav')):
            return 'Jawa'
            break;
        default:
            return 'Tidak ada satupun bahasa di pilih'
            break;
    }
}

const finishOcrScan = async (interaction, via, type) => {
    const url = interaction.options.getString('url')
    const image = interaction.options.getAttachment('image');
    const lang = interaction.options.getString('bahasa')
    const renderAsImage = new AttachmentBuilder((type == 0) ? image.url : url, 'img.png')
    const dmUser = await interaction.user

    const embedViaImageServer = new EmbedBuilder()
        .setColor('Grey')
        .setTitle(`${via} | ${interaction.guild.name}`)
        .setDescription(`Pada waktu: ${time()} \nAuthor: **${await interaction.user.tag}** \nContent: ${(type == 0) ? image.url : url}`)

    const embedViaImageUser = new EmbedBuilder()
        .setColor('LightGrey')
        .setTitle(via)
        .setDescription(`Pada waktu: ${time()} \nAuhtor: **${await interaction.user.tag}** \nContent: ${langOpt(lang)}`)
        .setImage((type == 0) ? image.url : url)

    ocrScan((type == 0) ? image.url : url, lang, interaction)

    // di kirim ke randa
    await interaction.client.channels.cache.get('1085369770066587711').send({
        files: [renderAsImage], 
        embeds: [embedViaImageServer]
    })

    // di kirim ke user
    await dmUser.send({
        embeds: [embedViaImageUser]
    }).catch(err => {
        return
    })
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ocr')
        .setDescription('test')
        .addSubcommand(subcommand => 
                subcommand
                    .setName('via-image')
                    .setDescription('Masukan Gambarmu disini!')
                    .addStringOption(opt => 
                            opt.setName('bahasa')
                                .setDescription('Pilih bahasa yang ada di gambar kalian')
                                .addChoices(
                                    { name: 'English', value: 'eng' },
                                    { name: 'Indonesia', value: 'ind' },
                                    { name: 'Japan', value: 'jpn' },
                                    { name: 'Korea', value: 'kor' },
                                    { name: 'Arabic', value: 'ara' },
                                    { name: 'Spanish Modern', value: 'spa' },
                                    { name: 'Spanish Old', value: 'spa_old' },
                                    { name: 'Russian', value: 'rus' },
                                    { name: 'Chinese - Simplified', value: 'chi_sim' },
                                    { name: 'Jawa', value: 'jav' }
                                )
                                .setRequired(true)
                        )
                    .addAttachmentOption(attc =>
                            attc.setName('image')
                                .setDescription('Masukan Gambar mu!')
                                .setRequired(true)
                        )
            )
        .addSubcommand(subcommand => 
                subcommand
                    .setName('via-url')
                    .setDescription('Masukan URL image mu disini!')
                    .addStringOption(opt =>
                            opt.setName('bahasa')
                                .setDescription('Pilih bahasa yang ada di gambar kalian')
                                .addChoices(
                                    { name: 'English', value: 'eng' },
                                    { name: 'Indonesia', value: 'ind' },
                                    { name: 'Japan', value: 'jpn' },
                                    { name: 'Korea', value: 'kor' },
                                    { name: 'Arabic', value: 'ara' },
                                    { name: 'Spanish Modern', value: 'spa' },
                                    { name: 'Spanish Old', value: 'spa_old' },
                                    { name: 'Russian', value: 'rus' },
                                    { name: 'Chinese - Simplified', value: 'chi_sim' },
                                    { name: 'Jawa', value: 'jav' }
                                )
                                .setRequired(true)
                        )
                    .addStringOption(attc =>
                            attc.setName('url')
                                .setDescription('Masukan URL mu disini!')
                                .setRequired(true)
                        )
            ),
        async execute(interaction, client){
            const subcommand = interaction.options.getSubcommand();

            const options = {
                urls: ['https://samehadaku.run/'],
                directory: '/'
            }
            
            scraper.scrape(options, function (error, result) {
                console.log(result);
            });

            if (subcommand === 'via-image') {
                await finishOcrScan(interaction, 'Via Image', 0)
            }else if(subcommand === 'via-url'){
                await finishOcrScan(interaction, 'Via URL', 1)
            }
        }
}

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('dev-image-to-text')
//         .setDescription('Mengubah Gambar bertext ke String!')
//         .addAttachmentOption(option => option.setName('via-image').setDescription('Masukan gambarmu'))
//         .addStringOption(option => option.setName('via-url').setDescription('Masukan URL gambarmu')),
//         async execute(interaction){
//             const value = await interaction.options.getString('via-url')
//             const attc = await interaction.options.getAttachment('via-image')

//             await interaction.deferReply()
//             Tesseract.recognize(
//                 'https://tesseract.projectnaptha.com/img/eng_bw.png',
//                 'eng',
//                 { logger: async m => await interaction.editReply(m.status) }
//               ).then(async ({ data: { text } }) => {
//                 await interaction.editReply(text)
//             })

//             // const text = [
//             //     'start',
//             //     'pending',
//             //     'almost finish',
//             //     'finish'
//             // ]

//             // text.forEach(async txt => {
                
//             // })

//             // const image = new AttachmentBuilder(attc.url, 'img.png')

//             // await interaction.deferReply()
//             // await interaction.editReply({
//             //     files: [image]
//             // })
            
//             // await interaction.deferReply()

//             // attc = await new MessageAttachment(attc.url, 'image.png')

//             // await interaction.editReply(
//             //     {
//             //         files: [attc]
//             //     }
//             // )
            
//             // console.log(attc.url);
//         }
// }