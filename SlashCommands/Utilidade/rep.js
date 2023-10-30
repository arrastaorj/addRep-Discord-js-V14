const discord = require("discord.js")
const ms = require("../../plugins/parseMs")
const rep = require("../../database/models/rep")

module.exports = {
    name: "rep",
    description: "Dê uma reputação para um usuário.",
    type: discord.ApplicationCommandType.ChatInput,
    options: [
        {
            name: "usuario",
            type: discord.ApplicationCommandOptionType.User,
            description: "Mencione o usuário.",
            required: true

        },
    ],

    run: async (client, interaction, args) => {


        const user = interaction.options.getUser('usuario')


        const cmd3 = await rep.findOne({
            guildId: interaction.guild.id,
            userId: interaction.user.id,

        })

        const timeout = 300000

        if (cmd3 !== null && timeout - (Date.now() - cmd3.Cd) > 0) {
            const time = ms(timeout - (Date.now() - cmd3.Cd))
            return interaction.reply({ content: `> \`-\` ⌛ Você está em **tempo de recarga**, Volte em **${time.minutes}** minutos **${time.seconds}**s`, ephemeral: true })
        } else {

            if (user === interaction.user) return interaction.reply({ content: `> \`-\` 🙅‍♀️ Por mais talentoso que você seja, não pode adicionar reputações para você mesmo!`, ephemeral: true })

            await rep.findOneAndUpdate(
                {
                    guildId: interaction.guild.id,
                    userId: interaction.user.id,
                },
                {
                    $set: {
                        "Cd": Date.now() + timeout
                    }
                },
                { upsert: true }
            )

            const cmd2 = await rep.findOne({
                guildId: interaction.guild.id,
                userId: user.id,

            })

            if (!cmd2) {
                const newCmd = {
                    guildId: interaction.guild.id,
                    userId: user.id,
                    Rep: 1
                }
                await rep.create(newCmd)
            } else {
                const currentRep = cmd2.Rep || 0
                await rep.findOneAndUpdate(
                    {
                        guildId: interaction.guild.id,
                        userId: user.id,
                    },
                    {
                        $set: { "Rep": currentRep + 1 }
                    }
                )
            }

            interaction.reply({ content: `> \`+\` 🎉 ${interaction.user} adicionou uma reputação a ${user}`, ephemeral: false })
        }
    }
}