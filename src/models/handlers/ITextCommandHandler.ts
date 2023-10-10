import { PrismaClient } from "@prisma/client"
import DiscordClient from "../../clients/discord/DiscordClient"
import { Message } from "discord.js"
import { HandlerTypes } from "../../types/HandlerTypes"

export default interface ITextCommandHandler {
  readonly textDetails: HandlerTypes.TextCommands.Details

  text(
    discordClient: DiscordClient,
    prismaClient: PrismaClient,
    message: Message,
    ...args: string[]
  ): Promise<void>
}
