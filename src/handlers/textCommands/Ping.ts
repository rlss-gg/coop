import { Message } from "discord.js"
import DiscordClient from "../../clients/discord/DiscordClient"
import TextCommand from "../../models/handlers/TextCommand"
import { PrismaClient } from "@prisma/client"

export default class Ping extends TextCommand {
  public override readonly name: string = "Ping"

  public async handle(
    client: DiscordClient,
    prismaClient: PrismaClient,
    message: Message
  ) {
    this._logger.log("INFO", "Ping command triggered")
    message.reply("Pong!")
  }
}
