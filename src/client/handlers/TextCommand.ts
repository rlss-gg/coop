import { Message } from "discord.js"
import IConfiguration from "../../configuration/IConfiguration"
import ILogger from "../../logger/ILogger"
import Client from "../Client"
import IHandler from "./IHandler"

export default abstract class TextCommand implements IHandler {
  protected readonly _configuration: IConfiguration
  protected readonly _logger: ILogger

  public abstract readonly name: string

  public constructor(configuration: IConfiguration, logger: ILogger) {
    this._configuration = configuration
    this._logger = logger
  }

  public abstract handle(client: Client, message: Message): Promise<void>
}
