const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dev-avatar')
        .setDescription('Get avatar URL from selected User or your own avatar')
        .addUserOption(option => option.setName('user').setDescription('Avatar this user will show')),
        async execute(interaction){
            const user = interaction.options.getUser('user')
            if(user) return interaction.reply(`${user.username} avatar: ${user.displayAvatarURL({ dynamic: true })}`)
            return interaction.reply(`Your avatar: ${interaction.user.displayAvatarURL()}`)
        }
}