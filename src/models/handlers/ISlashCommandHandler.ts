import { PrismaClient } from "@prisma/client"
import DiscordClient from "../../clients/discord/DiscordClient"
import { ChatInputCommandInteraction } from "discord.js"

export default interface ISlashCommandHandler {
  slash(
    discordClient: DiscordClient,
    prismaClient: PrismaClient,
    interaction: ChatInputCommandInteraction
  ): Promise<void>
}
