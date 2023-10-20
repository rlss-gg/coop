import DiscordHandler from "../models/handlers/DiscordHandler"
import { Message } from "discord.js"
import ChannelNotFoundError from "../errors/ChannelNotFoundError"
import WrongChannelTypeError from "../errors/WrongChannelTypeError"
import GuildNotFoundError from "../errors/GuildNotFoundError"
import userString from "../utils/userString"
import Event, { IEventHandler } from "../models/handlers/Event"

export default class MessageUpdateLogger
  extends DiscordHandler
  implements IEventHandler
{
  public readonly event = class extends Event("on", "messageUpdate") {
    public async run(oldMessage: Message, newMessage: Message): Promise<void> {
      if (oldMessage.author.bot) return

      // Get log channel
      const guildId = this._configuration.get("log.guildId")
      const channelId = this._configuration.get("log.channelId")

      const guild = await oldMessage.client.guilds.fetch(guildId)
      if (!guild) throw new GuildNotFoundError(guildId)

      const channel = await guild.channels.fetch(channelId)
      if (!channel) throw new ChannelNotFoundError(channelId)
      if (!channel.isTextBased()) throw new WrongChannelTypeError(channelId)

      // Send log message to log channel and logger
      const user = userString(oldMessage.author)
      const log = `${user} modified their message:\n\`\`\`\n${oldMessage.content}\n\`\`\`\nThe new message is:\n\`\`\`\n${newMessage.content}\n\`\`\``

      try {
        this._logger.log("INFO", log)
        channel.send(log)
      } catch (err) {
        this._logger.log(
          "WARNING",
          "Failed to send MessageUpdateLogger message"
        )
      }
    }
  }
}
