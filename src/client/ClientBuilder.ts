import IConfiguration from "../configuration/IConfiguration"
import ILogger from "../logger/ILogger"
import Client from "./Client"
import { Client as DjsClient, GatewayIntentBits } from "discord.js"
import Event from "./handlers/Event"
import { EventTypes } from "../types/EventTypes"
import TextCommand from "./handlers/TextCommand"
import { TextCommandTypes } from "../types/TextCommandTypes"
import DuplicateKeyError from "../errors/DuplicateKeyError"

export default class ClientBuilder {
  private readonly _configuration: IConfiguration
  private readonly _logger: ILogger

  public readonly gatewayIntentBits: GatewayIntentBits[] = []
  public readonly events: EventTypes.Collection = {}
  public readonly textCommands: TextCommandTypes.Collection = {}

  public constructor(configuration: IConfiguration, logger: ILogger) {
    this._configuration = configuration
    this._logger = logger
  }

  public useGatewayIntentBit(bit: GatewayIntentBits): ClientBuilder {
    this.gatewayIntentBits.push(bit)
    return this
  }

  public useGatewayIntentBits(...bits: GatewayIntentBits[]): ClientBuilder {
    bits.forEach(bit => this.useGatewayIntentBit(bit))
    return this
  }

  public addEvent<T extends Event>(
    ctor: EventTypes.Constructor<T>
  ): ClientBuilder {
    const event = new ctor(this._configuration, this._logger)
    if (!this.events[event.event]) this.events[event.event] = []
    this.events[event.event]!.push(event)
    return this
  }

  public addEvents<T extends Event>(
    ...ctors: EventTypes.Constructor<T>[]
  ): ClientBuilder {
    ctors.forEach(event => this.addEvent(event))
    return this
  }

  public addTextCommand<T extends TextCommand>(
    ctor: TextCommandTypes.Constructor<T>
  ): ClientBuilder {
    const command = new ctor(this._configuration, this._logger)
    if (this.textCommands[command.name])
      throw new DuplicateKeyError(command.name)
    this.textCommands[command.name] = command
    return this
  }

  public addTextCommands<T extends TextCommand>(
    ...ctors: TextCommandTypes.Constructor<T>[]
  ): ClientBuilder {
    ctors.forEach(textCommand => this.addTextCommand(textCommand))
    return this
  }

  public build(): Client {
    const djsClient = new DjsClient({ intents: this.gatewayIntentBits })
    return new Client(
      this._configuration,
      this._logger,
      djsClient,
      this.events,
      this.textCommands
    )
  }
}
