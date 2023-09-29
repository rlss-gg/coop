import Client from "../client/Client"
import Event from "../client/models/Event"
import IConfiguration from "../configuration/IConfiguration"
import ILogger from "../logger/ILogger"
import { Events, Message } from "discord.js"
import { EventTypes } from "../types/EventTypes"
import GuildNotFoundError from "../errors/GuildNotFoundError"
import ChannelNotFoundError from "../errors/ChannelNotFoundError"
import WrongChannelTypeError from "../errors/WrongChannelTypeError"
import sendInOrder from "../utils/sendInOrder"
import userString from "../utils/userString"

export default class MessageUpdateLogger extends Event {
  public override readonly name: string = "MessageUpdateLogger"
  public override readonly type: EventTypes.Type = "on"
  public override readonly event: Events = Events.MessageUpdate

  public constructor(configuration: IConfiguration, logger: ILogger) {
    super(configuration, logger)
  }

  public override async handle(
    client: Client,
    oldMessage: Message,
    newMessage: Message
  ): Promise<void> {
    // Get log channel
    const guildId = this._configuration.get("LOG_GUILD_ID")
    const channelId = this._configuration.get("LOG_CHANNEL_ID")

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
