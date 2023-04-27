const { SlashCommandBuilder, EmbedBuilder, time } = require('discord.js')
const { default: axios } = require('axios')
require('dotenv')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dev-ask')
        .setDescription('Tanya pada OpenAI.')
        .addStringOption(config => 
                config.setName('input')
                    .setDescription('Masukan pertanyaan mu disini')
            )
        .setDMPermission(true),
        async execute(interaction){
            var input = await interaction.options.getString('input')
            var data = JSON.stringify({
                "model": "gpt-3.5-turbo-0301",
                "messages" : [
                    {
                        "role": 'user',
                        "content": input
                    }
                ]
            })
        
            var config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: process.env.AI_URL,
                headers: {
                    "Content-Type": process.env.AI_CONTENT_TYPE,
                    "organization": process.env.AI_ORGANIZATION,
                    "Authorization": 'Bearer ' + process.env.AI_BEARERTOKEN
                },
                data: data
            }

            await interaction.deferReply()
            axios(config).then(async function(res){
                if(res.data.choices[0].message.content.length >= 2000){
                    await interaction.editReply('Response melebihi batas maksimum')
                }else{
                    var user = await interaction.user.id
                    var dmUser = await interaction.user


                    //kirim jawaban
                    await interaction.editReply(res.data.choices[0].message.content + `<@${user}> \n\n **mohon maaf jika bot mengalami loading yang lemot / 'The application did not respond' karna sepertinya IP PC Author di block untuk akses ke discord, sementara akan di alihkan ke IP public...**`)

                    const embed = new EmbedBuilder()
                        .setColor('Red')
                        .setDescription(`Pada waktu: ${time()} \nKamu bertanya pada AI: **${input}**`)

                    const embedLog = new EmbedBuilder()
                        .setColor('grey')
                        .setTitle(`Question from Server: ${interaction.guild.name}`)
                        .setDescription(`Pada jam: ${time()}\nQuestion: **${input}**\nFrom: **${interaction.user.tag}**`)

                    //kirim log ke server randamudesu
                    await interaction.client.channels.cache.get('1085369770066587711').send({
                        embeds: [embedLog]
                    })

                    //kirim log ke dm message author
                    await dmUser.send({
                        embeds: [embed]
                    }).catch(err => {
                        return
                    })

                    console.log(res.data.choices[0].message);
                    
                }
            }).catch(async function(error){
                if(error.response){
                    await interaction.editReply('something went wrong!')
                }
            })
        }
}