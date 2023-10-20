import DiscordHandler from "../models/handlers/DiscordHandler"
import { Message } from "discord.js"
import TextCommand, {
  ITextCommandHandler
} from "../models/handlers/TextCommand"

export default class PingCommand
  extends DiscordHandler
  implements ITextCommandHandler
{
  public readonly text = class extends TextCommand(this, "ping") {
    public async run(message: Message, ...args: string[]): Promise<void> {
      await message.reply("Pinging...").then(msg => {
        const start = message.createdTimestamp
        const finish = msg.createdTimestamp
        return msg.edit(`Pong! Latency is ${finish - start}ms.`)
      })
    }
  }
}
