import IConfiguration from "../../models/configuration/IConfiguration"
import DiscordClient from "../../clients/discord/DiscordClient"
import { Client as DjsClient, GatewayIntentBits } from "discord.js"
import DuplicateKeyError from "../../errors/DuplicateKeyError"
import PrismaClientFactory from "../../factories/database/PrismaClientFactory"
import ILoggerFactory from "../../factories/logger/ILoggerFactory"
import { HandlerTypes } from "../../types/HandlerTypes"

export default class DiscordClientBuilder {
  private readonly _configuration: IConfiguration
  private readonly _loggerFactory: ILoggerFactory
  private readonly _prismaClientFactory: PrismaClientFactory

  public readonly gatewayIntentBits: GatewayIntentBits[] = []
  public readonly handlers: HandlerTypes.Collection = {}

  public constructor(
    configuration: IConfiguration,
    loggerFactory: ILoggerFactory,
    prismaClientFactory: PrismaClientFactory
  ) {
    this._configuration = configuration
    this._loggerFactory = loggerFactory
    this._prismaClientFactory = prismaClientFactory
  }

  public useGatewayIntentBit(bit: GatewayIntentBits): DiscordClientBuilder {
    this.gatewayIntentBits.push(bit)
    return this
  }

  public useGatewayIntentBits(
    ...bits: GatewayIntentBits[]
  ): DiscordClientBuilder {
    bits.forEach(bit => this.useGatewayIntentBit(bit))
    return this
  }

  public addHandler(ctor: HandlerTypes.Constructor): DiscordClientBuilder {
    const handler = new ctor(
      this._configuration,
      this._loggerFactory.createLogger()
    )

    if (this.handlers[handler.name]) throw new DuplicateKeyError(handler.name)
    this.handlers[handler.name] = handler

    return this
  }

  public build(): DiscordClient {
    const djsClient = new DjsClient({ intents: this.gatewayIntentBits })

    return new DiscordClient(
      this._configuration,
      this._loggerFactory.createLogger(),
      this._prismaClientFactory.createClient(),
      djsClient,
      this.handlers
    )
  }
}
