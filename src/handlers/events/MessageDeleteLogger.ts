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

export default class MessageDeleteLogger extends Event {
  public override readonly name: string = "MessageDeleteLogger"
  public override readonly type: EventTypes.Type = "on"
  public override readonly event: Events = Events.MessageDelete

  public constructor(configuration: IConfiguration, logger: ILogger) {
    super(configuration, logger)
  }

  public override async handle(
    client: DiscordClient,
    prismaClient: PrismaClient,
    message: Message
  ): Promise<void> {
    // Get log channel
    const guildId = this._configuration.get("log.guildId")
    const channelId = this._configuration.get("log.channelId")

    const guild = await message.client.guilds.fetch(guildId)
    if (!guild) throw new GuildNotFoundError(guildId)

    const channel = await guild.channels.fetch(channelId)
    if (!channel) throw new ChannelNotFoundError(channelId)
    if (!channel.isTextBased()) throw new WrongChannelTypeError(channelId)

    // Send log message to log channel and logger
    const log = `${userString(
      message.author
    )} had sent the following message which has been deleted:\n\n\`\`\`\n${
      message.content
    }\n\`\`\``

    try {
      this._logger.log("INFO", log)
      channel.send(log)
    } catch (err) {
      this._logger.log("WARNING", "Failed to send MessageDeleteLogger message")

      try {
        sendInOrder(
          channel,
          `${userString(
            message.author
          )} had sent the following message which has been deleted:`,
          `\`\`\`\n${message.content}\n\`\`\``
        )
      } catch (err) {
        this._logger.log(
          "CRITICAL",
          "Failed to send MessageDeleteLogger message even when partitioned"
        )
      }
    }
  }
}
