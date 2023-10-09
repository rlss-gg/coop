import DiscordClient from "../../clients/discord/DiscordClient"
import Event from "../../models/handlers/Event"
import IConfiguration from "../../models/configuration/IConfiguration"
import ILogger from "../../models/logger/ILogger"
import { Events, Message } from "discord.js"
import { EventTypes } from "../../types/EventTypes"
import GuildNotFoundError from "../../errors/GuildNotFoundError"
import ChannelNotFoundError from "../../errors/ChannelNotFoundError"
import WrongChannelTypeError from "../../errors/WrongChannelTypeError"
import sendInOrder from "../../utils/sendInOrder"
import userString from "../../utils/userString"
import { PrismaClient } from "@prisma/client"

export default class MessageUpdateLogger extends Event {
  public override readonly name: string = "MessageUpdateLogger"
  public override readonly type: EventTypes.Type = "on"
  public override readonly event: Events = Events.MessageUpdate

  public constructor(configuration: IConfiguration, logger: ILogger) {
    super(configuration, logger)
  }

  public override async handle(
    client: DiscordClient,
    prismaClient: PrismaClient,
    oldMessage: Message,
    newMessage: Message
  ): Promise<void> {
    // Get log channel
    const guildId = this._configuration.get("log.guildId")
    const channelId = this._configuration.get("log.channelId")

    const guild = await oldMessage.client.guilds.fetch(guildId)
    if (!guild) throw new GuildNotFoundError(guildId)

    const channel = await guild.channels.fetch(channelId)
    if (!channel) throw new ChannelNotFoundError(channelId)
    if (!channel.isTextBased()) throw new WrongChannelTypeError(channelId)

    // Send log message to log channel and logger
    const log = `${userString(
      oldMessage.author
    )} had sent the following message which has been modified:\n\`\`\`\n${
      oldMessage.content
    }\n\`\`\`\nThe new message is:\n\`\`\`\n${newMessage.content}\n\`\`\``

    try {
      this._logger.log("INFO", log)
      channel.send(log)
    } catch (err) {
      this._logger.log("WARNING", "Failed to send MessageUpdateLogger message")

      try {
        sendInOrder(
          channel,
          `${userString(
            oldMessage.author
          )} had sent the following message which has been modified:`,
          `\`\`\`\n${oldMessage.content}\n\`\`\``,
          "The new message is:",
          `\`\`\`\n${newMessage.content}\n\`\`\``
        )
      } catch (err) {
        this._logger.log(
          "CRITICAL",
          "Failed to send MessageUpdateLogger message even when partitioned"
        )
      }
    }
  }
}
