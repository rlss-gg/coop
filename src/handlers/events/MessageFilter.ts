import DiscordClient from "../../clients/discord/DiscordClient"
import Event from "../../models/handlers/Event"
import IConfiguration from "../../models/configuration/IConfiguration"
import ILogger from "../../models/logger/ILogger"
import { Events, Message } from "discord.js"
import { EventTypes } from "../../types/EventTypes"
import { PrismaClient } from "@prisma/client"

export default class MessageFilter extends Event {
  public override readonly name: string = "MessageFilter"
  public override readonly type: EventTypes.Type = "on"
  public override readonly event: Events = Events.MessageCreate

  public constructor(configuration: IConfiguration, logger: ILogger) {
    super(configuration, logger)
  }

  public override async handle(
    client: DiscordClient,
    prismaClient: PrismaClient,
    message: Message
  ): Promise<void> {
    if (message.author.bot) return

    const blockWords = [""]
    const blockRegex = [/g/]

    if (blockWords.some(word => message.content.includes(word))) {
      // TODO: Log message to console and log channel
      message.delete()
      message.author.createDM().then(channel => channel.send(""))
    } else if (blockRegex.some(regex => regex.test(message.content))) {
      // TODO: Log message to console and log channel
      message.delete()
      message.author.createDM().then(channel => channel.send(""))
    }
  }
}
