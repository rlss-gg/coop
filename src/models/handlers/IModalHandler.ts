import { PrismaClient } from "@prisma/client"
import DiscordClient from "../../clients/discord/DiscordClient"
import { ModalSubmitInteraction } from "discord.js"

export default interface IModalHandler {
  select(
    discordClient: DiscordClient,
    prismaClient: PrismaClient,
    interaction: ModalSubmitInteraction
  ): Promise<void>
}
