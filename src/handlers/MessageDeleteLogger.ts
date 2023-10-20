import DiscordHandler from "../models/handlers/DiscordHandler"
import { Message } from "discord.js"
import ChannelNotFoundError from "../errors/ChannelNotFoundError"
import WrongChannelTypeError from "../errors/WrongChannelTypeError"
import GuildNotFoundError from "../errors/GuildNotFoundError"
import userString from "../utils/userString"
import Event, { IEventHandler } from "../models/handlers/Event"

export default class MessageDeleteLogger
  extends DiscordHandler
  implements IEventHandler
{
  public readonly event = class extends Event("on", "messageDelete") {
    public async run(message: Message): Promise<void> {
      if (message.author.bot) return

      // Get log channel
      const guildId = this._configuration.get("log.guildId")
      const channelId = this._configuration.get("log.channelId")

      const guild = await message.client.guilds.fetch(guildId)
      if (!guild) throw new GuildNotFoundError(guildId)

      const channel = await guild.channels.fetch(channelId)
      if (!channel) throw new ChannelNotFoundError(channelId)
      if (!channel.isTextBased()) throw new WrongChannelTypeError(channelId)

      // Send log message to log channel and logger
      const user = userString(message.author)
      const log = `${user} had sent the following message which has been deleted:\n\n\`\`\`\n${message.content}\n\`\`\``

      try {
        this._logger.log("INFO", log)
        await channel.send(log)
      } catch (err) {
        this._logger.log(
          "WARNING",
          "Failed to send MessageDeleteLogger message"
        )
      }
    }
  }
}
