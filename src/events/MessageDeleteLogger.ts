import Client from "../client/Client"
import Event from "../client/handlers/Event"
import IConfiguration from "../configuration/IConfiguration"
import ILogger from "../logger/ILogger"
import { Events, Message } from "discord.js"
import { EventTypes } from "../types/EventTypes"
import GuildNotFoundError from "../errors/GuildNotFoundError"
import ChannelNotFoundError from "../errors/ChannelNotFoundError"
import WrongChannelTypeError from "../errors/WrongChannelTypeError"
import sendInOrder from "../utils/sendInOrder"
import userString from "../utils/userString"

export default class MessageDeleteLogger extends Event {
  public override readonly name: string = "MessageDeleteLogger"
  public override readonly type: EventTypes.Type = "on"
  public override readonly event: Events = Events.MessageDelete

  public constructor(configuration: IConfiguration, logger: ILogger) {
    super(configuration, logger)
  }

  public override async handle(
    client: Client,
    message: Message
  ): Promise<void> {
    // Get log channel
    const guildId = this._configuration.get("LOG_GUILD_ID")
    const channelId = this._configuration.get("LOG_CHANNEL_ID")

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
