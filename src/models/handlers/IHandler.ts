import { PrismaClient } from "@prisma/client"
import DiscordClient from "../../clients/discord/DiscordClient"

export default interface IHandler {
  name: string

  handle(
    client: DiscordClient,
    prismaClient: PrismaClient,
    ...args: any[]
  ): Promise<void>
}
