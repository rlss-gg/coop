import IConfiguration from "../../configuration/IConfiguration"
import ILogger from "../../logger/ILogger"
import { EventTypes } from "../../types/EventTypes"
import Client from "../Client"
import { Events } from "discord.js"

export default abstract class Event {
  protected readonly _configuration: IConfiguration
  protected readonly _logger: ILogger

  public abstract readonly name: string
  public abstract readonly type: EventTypes.Type
  public abstract readonly event: Events

  public constructor(configuration: IConfiguration, logger: ILogger) {
    this._configuration = configuration
    this._logger = logger
  }

  public abstract handle(client: Client, ...args: any[]): Promise<void>
}
