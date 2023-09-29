import { Message } from "discord.js"
import Client from "../client/Client"
import TextCommand from "../client/handlers/TextCommand"

export default class Ping extends TextCommand {
  public override readonly name: string = "Ping"

  public async handle(client: Client, message: Message) {
    this._logger.log("INFO", "Ping command triggered")
    message.reply("Pong!")
  }
}
