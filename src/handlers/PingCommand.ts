import { PrismaClient } from "@prisma/client"
import DiscordClient from "../clients/discord/DiscordClient"
import DiscordHandler from "../models/handlers/DiscordHandler"
import ITextCommandHandler from "../models/handlers/ITextCommandHandler"
import { Message } from "discord.js"

export default class extends DiscordHandler implements ITextCommandHandler {
  public readonly name: string = "PingCommand"
  public readonly textDetails = {
    name: "ping"
  }

  public async text(
    discordClient: DiscordClient,
    prismaClient: PrismaClient,
    message: Message,
    ...args: string[]
  ): Promise<void> {
    // Send initial ping message
    await message.reply("Pinging...").then(msg => {
      const start = message.createdTimestamp
      const finish = msg.createdTimestamp
      return msg.edit(`Pong! Latency is ${finish - start}ms.`)
    })
  }
}
