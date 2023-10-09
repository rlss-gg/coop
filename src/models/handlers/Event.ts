import IConfiguration from "../../models/configuration/IConfiguration"
import ILogger from "../../models/logger/ILogger"
import { EventTypes } from "../../types/EventTypes"
import DiscordClient from "../../clients/discord/DiscordClient"
import { Events } from "discord.js"
import IHandler from "./IHandler"
import { PrismaClient } from "@prisma/client"

export default abstract class Event implements IHandler {
  protected readonly _configuration: IConfiguration
  protected readonly _logger: ILogger

  public abstract readonly name: string
  public abstract readonly type: EventTypes.Type
  public abstract readonly event: Events

  public constructor(configuration: IConfiguration, logger: ILogger) {
    this._configuration = configuration
    this._logger = logger
  }

  public abstract handle(
    discordClient: DiscordClient,
    prismaClient: PrismaClient,
    ...args: any[]
  ): Promise<void>
}
