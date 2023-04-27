const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('dev-kick')
        .setDescription('Untuk kick Member')
        .addUserOption(option => option.setName('user').setDescription('User yang akan di kick dari server ini...').setRequired(true))
        .addStringOption(option => option.setName('reason').setDescription('Alasan kenapa dia di kick')),
        async execute(interaction, client) {
            const kickUser = interaction.options.getUser('user')
            const kickMember = await interaction.guild.members.fetch(kickUser.id)
            const member = interaction.options.getMember('user')
            const channel = interaction.channel

            if(!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)){
                return await interaction.reply({
                    content: 'Kamu tidak punya permission untuk kick orang ini!',
                    ephemeral: true
                })
            }
            
            if(!member){
                return await interaction.reply({
                    content: 'Orang yang anda kick tidak ada di server ini!',
                    ephemeral: true
                })
            }
            
            if(!member.kickable){
                return await interaction.reply({
                    content: 'Tidak bisa kick orang ini! karna role kamu lebih rendah!',
                    ephemeral: true
                })
            }

            let reason = interaction.options.getString('reason')
            if(!reason){
                reason = 'Tidak di berikan alasan'
            }

            const dmEmbeed = new EmbedBuilder()
                .setColor('Random')
                .setDescription(`Kamu telah di kick dari **${interaction.guild.name}** | ${reason}`)

            const embed = new EmbedBuilder()
                .setColor('Random')
                .setDescription(`${kickUser.tag} sudah di kick | ${reason}`)

            await member.send({
                embeds: [dmEmbeed]
            }).catch(err => {
                return
            })

            await member.kick({
                reason: reason
            }).catch(err => {
                interaction.reply({
                    content: 'Ada sesuatu yang salah!', 
                    ephemeral: true
                })
            })

            await interaction.reply({
                embeds: [embed]
            })
        }
}