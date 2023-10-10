import IConfiguration from "../configuration/IConfiguration"
import ILogger from "../logger/ILogger"
import IButtonHandler from "./IButtonHandler"
import IDiscordHandler from "./IDiscordHandler"
import IEventHandler from "./IEventHandler"
import IMessageContextHandler from "./IMessageContextHandler"
import IModalHandler from "./IModalHandler"
import ISelectMenuHandler from "./ISelectMenuHandler"
import ISlashCommandHandler from "./ISlashCommandHandler"
import ITextCommandHandler from "./ITextCommandHandler"
import IUserContextHandler from "./IUserContextHandler"

export default abstract class DiscordHandler implements IDiscordHandler {
  protected readonly _configuration: IConfiguration
  protected readonly _logger: ILogger

  public abstract readonly name: string

  public constructor(configuration: IConfiguration, logger: ILogger) {
    this._configuration = configuration
    this._logger = logger
  }

  public isEventHandler(): this is IEventHandler {
    return "event" in this
  }

  public isTextCommandHandler(): this is ITextCommandHandler {
    return "text" in this
  }

  public isSlashCommandHandler(): this is ISlashCommandHandler {
    return "slash" in this
  }

  public isButtonHandler(): this is IButtonHandler {
    return "button" in this
  }

  public isSelectMenuHandler(): this is ISelectMenuHandler {
    return "select" in this
  }

  public isUserContextHandler(): this is IUserContextHandler {
    return "user" in this
  }

  public isMessageContextHandler(): this is IMessageContextHandler {
    return "message" in this
  }

  public isModalHandler(): this is IModalHandler {
    return "modal" in this
  }
}
