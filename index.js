const { Client, Collection, Events, GatewayIntentBits, REST, time, EmbedBuilder, Embed, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js')
const date = require('date-and-time')
const fs = require('node:fs')
const path = require('node:path')
const { token } = require('./config.json');
const { default: axios } = require('axios');
const user = require('./commands/user');
const paginationEmbed = require('discordjs-button-pagination')
require('axios')
require('dotenv/config')
let tyoData = fs.readFileSync('./asset/textForTyo.json')
let tyos = JSON.parse(tyoData)
// console.log(t.pages[0].blocks[1].paragraphs[0].words[1].symbols);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences
    ],
})

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.on('ready', (state) => {
    console.log(`login in as ${client.user.tag}`);
    client.user.setStatus('online')
    client.user.setActivity('Using /ask for to bot', {
        url: 'https://discord.com/api/oauth2/authorize?client_id=1080667316284575764&permissions=8&scope=bot%20applications.commands'
    })
})

const configApiModel = (url, method, message) => {
    var config = {
        method: method,
        maxBodyLength: Infinity,
        url: url,
        headers: {
            'Content-Type': process.env.AI_CONTENT_TYPE,
            'organization': process.env.AI_ORGANIZATION,
            'Authorization': 'Bearer ' + process.env.AI_BEARERTOKEN
        },
    }

    axios(config).then(function(res){
        res.data.data.forEach(element => {
            message.author.send('``` Model ID: ' + element.id + '\nOwned By: ' + element.owned_by + '```').catch(console.error)

        });

        message.channel.send('Silahkan cek DM kamu!')
    }).catch(function(error){
        console.log(error);
    })
}

client.on('messageCreate', async (message) => {
    const prefixGlobal = message.content.substring(0, 3)

    if(message.content == '<@1080667316284575764>'){
        message.channel.send('Pesan Rahasia berhasil di kirim!')
        console.log(tyos[Math.floor(Math.random() * tyos.length)].text);

        setTimeout(() => {
            // DM ke tyo
            client.users.fetch('433113095355760641', false).then((user) => {
                user.send(tyos[Math.floor(Math.random() * tyos.length)].text)
            })
            
            // Kirim pesan ke rapat petinggi dan tag tyo
            client.channels.cache.get('694156139994284072').send(`Halo <@433113095355760641> Silahkan cek DM kamu ya bang ganteng...`)
        }, 1500);
    }

    if(prefixGlobal == '!ai'){
        if(message.content == prefixGlobal + " ping"){
            message.channel.send('Pong for ' + message.author.username + ' at ' + time())
        }else if(message.content.substring(0, 7) == '!ai msg'){
            const questionForAI = message.content.split(prefixGlobal + ' msg')
            var data = JSON.stringify({
                "model": "gpt-3.5-turbo-0301",
                "messages": [
                    {
                        "role": "user",
                        "content": questionForAI[1]
                    }
                ]
            })
    
            var config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: process.env.AI_URL,
                headers: {
                    'Content-Type': process.env.AI_CONTENT_TYPE,
                    'organization': process.env.AI_ORGANIZATION,
                    'Authorization': 'Bearer ' + process.env.AI_BEARERTOKEN
                },
                data: data
            }
    
            axios(config).then(function(res){
                if(res.data.choices[0].message.content.length >= 2000){
                    message.reply('response melebihi batas maksimum')
                }else{
                    console.log(res.data.choices[0].message);
                    message.reply(res.data.choices[0].message.content + '\n\n\n**lebih di sarankan pakai /ask :prompt lalu cari nama bot ini...**')

                    const embed = new EmbedBuilder()
                        .setColor('White')
                        .setTitle(`Question from Server: ${message.guild.name}`)
                        .setDescription(`Pada jam: ${time()}\nQuestion: **${questionForAI[1]}**\nFrom: **${message.author.tag}**`)

                    client.channels.cache.get('1085369770066587711').send({
                        embeds: [embed]
                    })
                }
            }).catch(function(error){
                console.log(error);
            })
    
            // private dm
            message.author.send('Di Jam dan Hari: ' + time() + '\nKamu tanya tentang: **' + questionForAI[1] + '**').catch(console.error)
        }else if(message.content == prefixGlobal + " model"){
            configApiModel(process.env.AI_URL_MODELS, 'get', message)
        }else if(message.content == prefixGlobal + ' server'){
            // return message.channel.send('Total List Server: ' + client.guilds.cache.size);
            var objectServer = []
            const embedPageOne = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`List server : ${client.guilds.cache.size}`)  
                .setAuthor({
                    name: message.author.username,
                    iconURL: message.author.avatarURL(),
                    url: 'https://discord.com/api/oauth2/authorize?client_id=1080667316284575764&permissions=8&scope=bot%20applications.commands'
                })
                .setTimestamp()
                .setFooter({
                    text: `Total server: ${client.guilds.cache.size}`
                })
            
            const embedPageTwo = new EmbedBuilder()
                .setColor('Random')
                .setTitle(`List server: ${client.guilds.cache.size}`)
                .setAuthor({
                    name: message.author.username,
                    iconURL: message.author.avatarURL(),
                    url: 'https://discord.com/api/oauth2/authorize?client_id=1080667316284575764&permissions=8&scope=bot%20applications.commands'
                })
                .setFooter({
                    text: `Total server: ${client.guilds.cache.size}`
                })

            const buttonPrev = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('prev')
                        .setLabel('Prev')
                        .setStyle(ButtonStyle.Secondary),
                )
            
            const buttonNext = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                        .setCustomId('next')
                        .setLabel('Next')
                        .setStyle(ButtonStyle.Primary)
                    )

            if (!client.guilds.cache.size <= 25) {
                client.guilds.cache.map(guild => {
                    objectServer.push({
                        id: guild.id,
                        name: guild.name,
                        allMember: guild.memberCount,
                        memberCount: guild.members.cache.filter(member => !member.user.bot).size,
                        bot: guild.members.cache.filter(member => member.user.bot).size,
                        joinedTimestamp: guild.joinedTimestamp
                    })
                })
            }

            const maxDiscord = 25
            const sisaCount = objectServer.length - maxDiscord
            // looping pertama
            objectServer.forEach((guild, index) => {
                if (index < maxDiscord) {
                    embedPageOne.addFields(
                        {
                            name: guild.name,
                            value: '```ID server: ' + guild.id + ' \nTotal Member: ' + guild.memberCount + ' \nTotal Bot: ' + guild.bot + ' \nCount member: ' + guild.allMember + '``` Join At: ' + time(guild.joinedTimestamp),
                            inline: true
                        }
                    )
                }
            })

            // looping kedua
            objectServer.slice(maxDiscord, objectServer.length).forEach((guild, index) => {
                embedPageTwo.addFields(
                    {
                        name: guild.name,
                        value: '```ID server: ' + guild.id + ' \nTotal Member: ' + guild.memberCount + ' \nTotal Bot: ' + guild.bot + ' \nCount member: ' + guild.allMember + '``` Join At: ' + time(guild.joinedTimestamp),
                        inline: true
                    }
                )
            })

            message.channel.send({
                embeds: [embedPageOne],
                components: [buttonNext]
            })

            const collector = message.channel.createMessageComponentCollector()

            collector.on('collect', async i => {
                if (i.customId == 'next') {
                    await i.update(
                        {
                            embeds: [embedPageTwo],
                            components: [buttonPrev]
                        }
                    ).catch(async err => {
                        await interaction.reply({
                            content: 'Maaf coba lagi...',
                            ephemeral: true
                        })
                    })
                }else{
                    await i.update(
                        {
                            embeds: [embedPageOne],
                            components: [buttonNext]
                        }
                    ).catch(async err => {
                        await interaction.reply({
                            content: 'Maaf coba lagi...',
                            ephemeral: true
                        })
                    })
                }
            })
        }
    }
})

client.login(process.env.TOKEN)