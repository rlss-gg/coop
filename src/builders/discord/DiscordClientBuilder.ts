import IConfiguration from "../../models/configuration/IConfiguration"
import DiscordClient from "../../clients/discord/DiscordClient"
import { Client as DjsClient, GatewayIntentBits } from "discord.js"
import Event from "../../models/handlers/Event"
import { EventTypes } from "../../types/EventTypes"
import TextCommand from "../../models/handlers/TextCommand"
import { TextCommandTypes } from "../../types/TextCommandTypes"
import DuplicateKeyError from "../../errors/DuplicateKeyError"
import PrismaClientFactory from "../../factories/database/PrismaClientFactory"
import ILoggerFactory from "../../factories/logger/ILoggerFactory"

export default class DiscordClientBuilder {
  private readonly _configuration: IConfiguration
  private readonly _loggerFactory: ILoggerFactory
  private readonly _prismaClientFactory: PrismaClientFactory

  public readonly gatewayIntentBits: GatewayIntentBits[] = []
  public readonly events: EventTypes.Collection = {}
  public readonly textCommands: TextCommandTypes.Collection = {}

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

  public addEvent<T extends Event>(
    ctor: EventTypes.Constructor<T>
  ): DiscordClientBuilder {
    const event = new ctor(
      this._configuration,
      this._loggerFactory.createLogger()
    )
    if (!this.events[event.event]) this.events[event.event] = []
    this.events[event.event]!.push(event)
    return this
  }

  public addEvents<T extends Event>(
    ...ctors: EventTypes.Constructor<T>[]
  ): DiscordClientBuilder {
    ctors.forEach(event => this.addEvent(event))
    return this
  }

  public addTextCommand<T extends TextCommand>(
    ctor: TextCommandTypes.Constructor<T>
  ): DiscordClientBuilder {
    const command = new ctor(
      this._configuration,
      this._loggerFactory.createLogger()
    )
    if (this.textCommands[command.name])
      throw new DuplicateKeyError(command.name)
    this.textCommands[command.name] = command
    return this
  }

  public addTextCommands<T extends TextCommand>(
    ...ctors: TextCommandTypes.Constructor<T>[]
  ): DiscordClientBuilder {
    ctors.forEach(textCommand => this.addTextCommand(textCommand))
    return this
  }

  public build(): DiscordClient {
    const djsClient = new DjsClient({ intents: this.gatewayIntentBits })

    return new DiscordClient(
      this._configuration,
      this._loggerFactory.createLogger(),
      this._prismaClientFactory.createClient(),
      djsClient,
      this.events,
      this.textCommands
    )
  }
}
