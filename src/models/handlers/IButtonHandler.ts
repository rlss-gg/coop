import { PrismaClient } from "@prisma/client"
import DiscordClient from "../../clients/discord/DiscordClient"
import { ButtonInteraction } from "discord.js"

export default interface IButtonHandler {
  button(
    discordClient: DiscordClient,
    prismaClient: PrismaClient,
    interaction: ButtonInteraction
  ): Promise<void>
}
