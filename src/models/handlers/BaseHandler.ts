import { PrismaClient } from "@prisma/client"
import PrismaClientFactory from "../../factories/database/PrismaClientFactory"
import ILogger from "../logger/ILogger"
import ILoggerFactory from "../../factories/logger/ILoggerFactory"
import IConfiguration from "../configuration/IConfiguration"
import Inject from "../../decorators/di/Inject"
import { IDiscordHandler } from "./DiscordHandler"

export abstract class BaseHandler<T extends IDiscordHandler = IDiscordHandler> {
  @Inject("configuration")
  protected readonly _configuration!: IConfiguration

  @Inject("loggerFactory")
  private readonly _loggerFactory!: ILoggerFactory
  protected readonly _logger: ILogger

  @Inject("prismaClientFactory")
  private readonly _prismaClientFactory!: PrismaClientFactory
  protected readonly _prismaClient: PrismaClient

  protected readonly _handler: T

  public constructor(handler: T) {
    this._logger = this._loggerFactory.createLogger()
    this._prismaClient = this._prismaClientFactory.createClient()

    this._handler = handler
  }
}
