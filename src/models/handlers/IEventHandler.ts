import { PrismaClient } from "@prisma/client"
import DiscordClient from "../../clients/discord/DiscordClient"
import { HandlerTypes } from "../../types/HandlerTypes"

export default interface IEventHandler {
  readonly eventDetails: HandlerTypes.Events.Details

  event(
    discordClient: DiscordClient,
    prismaClient: PrismaClient,
    ...args: any[]
  ): Promise<void>
}
