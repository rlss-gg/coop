import { PrismaClient } from "@prisma/client"
import DiscordClient from "../../clients/discord/DiscordClient"
import { UserContextMenuCommandInteraction } from "discord.js"

export default interface IUserContextHandler {
  user(
    discordClient: DiscordClient,
    prismaClient: PrismaClient,
    interaction: UserContextMenuCommandInteraction
  ): Promise<void>
}
