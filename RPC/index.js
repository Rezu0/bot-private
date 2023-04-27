require('dotenv')
const ID = 1082585663473451008
const DiscordRPC = require('discord-rpc')
const RPC = new DiscordRPC.Client({
    transport: 'ipc'
})

DiscordRPC.register('1082585663473451008')

async function activity(){
    if(!RPC) return

    RPC.setActivity({
        details: 'RPC Details',
        state: 'RPC State',
        largeImageKey: 'https://fronty.com/static/uploads/robotics/openai.png',
        largeImageText: 'Discord BOT with OpenAI',
        smallImageKey: 'https://cdn.discordapp.com/avatars/383088246877585408/c079b7f66a3200320d901295771f43b7.webp',
        smallImageText: 'My GF',
        instance: false,
        startTimestamp: Date.now(),
        endTimestamp: Date.now(),
        buttons: [
            {
                label: 'Invite to Your Channel',
                url: 'https://discord.com/api/oauth2/authorize?client_id=1080667316284575764&permissions=8&scope=bot%20applications.commands'
            }
        ]
    })
}

RPC.on('ready', async () => {
    console.log('RPC Setting UP!');
    activity()

    setInterval(() => {
        activity()
    }, 15 * 1000);
})

RPC.login({
    clientId: ID
})