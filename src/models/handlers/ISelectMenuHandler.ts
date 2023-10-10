import { PrismaClient } from "@prisma/client"
import DiscordClient from "../../clients/discord/DiscordClient"
import { AnySelectMenuInteraction } from "discord.js"

export default interface ISelectMenuHandler {
  select(
    discordClient: DiscordClient,
    prismaClient: PrismaClient,
    interaction: AnySelectMenuInteraction
  ): Promise<void>
}
