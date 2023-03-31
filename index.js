const { default: axios, Axios } = require('axios');
// const { LocalStorage } = require('node-localstorage');
const { Client, GatewayIntentBits, REST } = require('discord.js');
const fetch = (...args) =>
import('node-fetch').then(({ default: fetch }) => fetch(...args));
const Tesseract = require('tesseract.js')
// const vision = require('@google-cloud/vision');
// const clientGoogle = new vision.ImageAnnotatorClient({
//     keyFilename: 'vision-api-382004-fb0551d1161d.json'
// })
require('dotenv/config')
require('axios')

// ** untuk connect ke google vision
// clientGoogle.labelDetection('https://cdn.discordapp.com/attachments/1087307643128909884/1090087672611090462/image.png')
//     .then(results => {
//         const labels = results[0].labelAnnotations
//         labels.forEach((labels) => console.log(labels.description))
//     }).catch(err => {
//         console.error('ERROR: ', err);
//     })

// const img = "https://tesseract.projectnaptha.com/img/eng_bw.png"

// Tesseract.recognize(
//     'https://cdn.discordapp.com/attachments/1087307643128909884/1090087672611090462/image.png',
//     'KOR',
//     { logger: m => console.log(m) }
// ).then(({ data: { text } }) => {
//     console.log(text);
// })

if(typeof localStorage === 'undefined' || localStorage === null){
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch')
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ],
})

function removeDataLocal(message){
    localStorage.removeItem('finalStorage')
    localStorage.removeItem('finalUrl')
    localStorage.removeItem('finalTitle')
    localStorage.removeItem('allDataID')

    message.channel.send('Local data remove...')

    setTimeout(() => {
        message.delete()
    }, 1000);
}

function saveDataTemp(message){
    var arrID = [],
        arrURL = [],
        arrTitle = []
    const config = {
        method: 'get',
        url: process.env.LINK_API,
        headers: { }
    }
    
    axios(config)
        .then(function(res){
            res.data.items.forEach(item => {
                arrID.push(item.id)
                arrURL.push(item.url)
                arrTitle.push(item.title)
            });
            
            if(arrID.toString() == localStorage.getItem('finalStorage')){
                message.channel.send('Tidak ada Update!')
            }else{
                localStorage.setItem('finalUrl', arrURL.toString())
                localStorage.setItem('finalTitle', arrTitle.toString())
                localStorage.setItem('finalStorage', arrID.toString())
                message.channel.send('Data sudah di Update!')
            }

        })
}

function fetchApiJavDesu(message){
    var data = []
    var splitURL = localStorage.getItem('finalUrl').split(',')
    var splitTitle = localStorage.getItem('finalTitle').split(',')
    
    for (let i = 0; i < splitURL.length; i++) {
        data[i] = {
            'URL': splitURL[i],
            'Title': splitTitle[i]
        }
    }

    data.reverse()
    data.forEach(el => {
        message.channel.send(el.Title + '\n' + el.URL)
    });
}

function restartBot(message){
    const id = [
        { name: 'Rezu', id: '383088246877585408' },
        { name: 'Ferdi', id: '586181794467151892' }
    ]

    id.forEach(el => {
        if (message.author == el.id) {
            message.channel.send('Restarting...').then(msg => {
                message.delete()
                client.destroy()
                setTimeout(() => {
                    client.login(process.env.TOKEN)
                    message.channel.send('Bot ready to go!')
                }, 1500);
            })
        }
    });
}

function embedHelp(message){
    const color = 15300753
    const embed = {
        color: color,
        title: 'Prefix This Bot!',
        author: {
            name: message.author.tag,
            icon_url: message.author.displayAvatarURL
        },
        description: "**1. !desu ( For Update Jav-desu )\n2. !desu ping ( Ping This Bot! )\n3. !desu prefix ( Show all prefix this bot! )\n4. !desu restart ( Restart server bot! )\n5. !desu check ( Check if data updated or not )\n6. !desu remove ( Remove data local )**",
    }
    message.channel.send({ embeds: [embed] })
}

function middlewareAdmin(id){
    switch (true) {
        case (id == '383088246877585408'):
            return true
            break;
        case (id == '586181794467151892'):
            return true
            break;
        case (id == '1052631570302910595'):
            return true
            break;
        default:
            return false
            break;
    }
}

function saveDataIgo(message){
    var finalData;
    var tempDataOne = [],
        tempDataTwo = [],
        tempID = [],
        dataUrl = [],
        dataTitle = [],
        dataSementara = '',
        dataTitleSementara = '',
        finalTemp = ''

    var configOne = {
        method: 'get',
        maxBodyLength: Infinity,
        url: process.env.LINK_API_IGO_ONE
    }

    axios(configOne).then(function(res){
        res.data.items.forEach(el => {
            tempDataOne.push(el)
        })

        var configTwo = {
            method: 'get',
            maxBodyLength: Infinity,
            url: process.env.LINK_API_IGO_TWO
        }

        // kedua
        axios(configTwo).then(function(res){
            res.data.items.forEach(el => {
                tempDataTwo.push(el)
            })

            finalData = [...tempDataTwo, ...tempDataOne]

            finalData.reverse()
            finalData.forEach(el => {
                tempID.push(el.id)
                dataUrl.push(el.url)
                dataTitle.push(el.title)
            })

            dataSementara = finalData[0].id
            dataTitleSementara = finalData[0].title

            finalTemp = localStorage.getItem('lastOne')
            localStorage.setItem('finalTemp', finalTemp)

            if(tempID.toString() == localStorage.getItem('allDataID')){
                message.reply(`Tidak ada update! \n **Last data**: ${dataTitleSementara}`)
            }else{
                localStorage.setItem('allDataID', tempID.toString())
                localStorage.setItem('lastOne', dataSementara)
                localStorage.setItem('dataUrl', dataUrl)
                localStorage.setItem('dataTitle', dataTitle)

                message.reply(`Data sudah di Update! \n **Last data**: ${dataTitleSementara}`)
            }
        }).catch(function(err){
            if(err.response){
                message.reply(`data 2 ${err.response.statusText} (${err.response.status})`)
            }
        }) 

    }).catch(function(err){
        if(err.response){
            message.reply(`data 1 ${err.response.statusText} (${err.response.status})`)
        }
    })
}

function fetchApiIgoDesu(message){
    var split = localStorage.getItem('allDataID').split(',')
    var checkingWhere = split.indexOf(localStorage.getItem('finalTemp'))
    var splitUrl = localStorage.getItem('dataUrl').split(',')
    var splitTitle = localStorage.getItem('dataTitle').split(',')
    var kosong = []

    if (checkingWhere == 0) {
        for (let i = 0; i < splitUrl.length; i++) {
            kosong[i] = {
                'url': splitUrl[i],
                'title': splitTitle[i]
            }
        }

        kosong.forEach(el => {
            message.channel.send(`${el.title} \n${el.url}`)
        });
    }else{
        for (let i = 0; i < checkingWhere; i++) {
            kosong[i] = {
                'url': splitUrl[i],
                'title': splitTitle[i]
            }
        }

        kosong.forEach(el => {
            message.channel.send(`${el.title} \n${el.url}`)
        })
    }
}

client.on('ready', () => {
    console.log('The bot is ready');
})

client.on('messageCreate', message => {
    if(message.content === '!desu'){
        if(middlewareAdmin(message.author.id)){
            fetchApiJavDesu(message)
        }else{
            message.channel.send('Anda bukan admin')
        }
    }else if(message.content === '!desu ping'){
        message.reply('pong ' + message)
        console.log(message.author);

        var firstLetter = message.content.split(' ', 1) == '!'
    }else if (message.content === '!desu restart') {
        restartBot(message)
    }else if(message.content === '!desu prefix'){
        embedHelp(message)
        // message.channel.send(embed)
    }else if(message.content === '!desu check'){
        if(middlewareAdmin(message.author.id)){
            saveDataTemp(message)
        }else{
            message.channel.send('Anda bukan admin')
        }
        // saveDataTemp(message)
    }else if(message.content === '!desu remove'){
        removeDataLocal(message)
    }else if(message.content === '!desu test'){
        console.log(middlewareAdmin(message.author.id))
    }else if(message.content === '!igo check'){
        saveDataIgo(message)
    }else if(message.content === '!igo'){
        fetchApiIgoDesu(message)
    }
})

client.login(process.env.TOKEN)