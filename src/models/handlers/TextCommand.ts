import { Message } from "discord.js"
import IConfiguration from "../../models/configuration/IConfiguration"
import ILogger from "../../models/logger/ILogger"
import DiscordClient from "../../clients/discord/DiscordClient"
import IHandler from "./IHandler"
import { PrismaClient } from "@prisma/client"

export default abstract class TextCommand implements IHandler {
  protected readonly _configuration: IConfiguration
  protected readonly _logger: ILogger

  public abstract readonly name: string

  public constructor(configuration: IConfiguration, logger: ILogger) {
    this._configuration = configuration
    this._logger = logger
  }

  public abstract handle(
    client: DiscordClient,
    prismaClient: PrismaClient,
    message: Message
  ): Promise<void>
}
