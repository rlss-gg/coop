import { PrismaClient } from "@prisma/client"
import DiscordClient from "../../clients/discord/DiscordClient"
import { MessageContextMenuCommandInteraction } from "discord.js"

export default interface IMessageContextHandler {
  message(
    discordClient: DiscordClient,
    prismaClient: PrismaClient,
    interaction: MessageContextMenuCommandInteraction
  ): Promise<void>
}
