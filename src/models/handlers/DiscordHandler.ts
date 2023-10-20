import Inject from "../../decorators/di/Inject"
import PrismaClientFactory from "../../factories/database/PrismaClientFactory"
import ILoggerFactory from "../../factories/logger/ILoggerFactory"
import IConfiguration from "../configuration/IConfiguration"
import { IButtonHandler } from "./Button"
import { IEventHandler } from "./Event"
import { IMessageContextHandler } from "./MessageContext"
import { IModalHandler } from "./Modal"
import { ISelectMenuHandler } from "./SelectMenu"
import { ISlashCommandHandler } from "./SlashCommand"
import { ITextCommandHandler } from "./TextCommand"
import { IUserContextHandler } from "./UserContext"

export interface IDiscordHandler {
  readonly name: string

  isEventHandler(): this is IEventHandler

  isTextCommandHandler(): this is ITextCommandHandler

  isInteractionHandler(): this is
    | ISlashCommandHandler
    | IButtonHandler
    | ISelectMenuHandler
    | IUserContextHandler
    | IMessageContextHandler
    | IModalHandler

  isSlashCommandHandler(): this is ISlashCommandHandler

  isButtonHandler(): this is IButtonHandler

  isSelectMenuHandler(): this is ISelectMenuHandler

  isUserContextHandler(): this is IUserContextHandler

  isMessageContextHandler(): this is IMessageContextHandler

  isModalHandler(): this is IModalHandler
}

export default abstract class DiscordHandler implements IDiscordHandler {
  @Inject("configuration")
  protected readonly _configuration!: IConfiguration

  @Inject("loggerFactory")
  protected readonly _loggerFactory!: ILoggerFactory

  @Inject("prismaClientFactory")
  protected readonly _prismaClientFactory!: PrismaClientFactory

  public get name(): string {
    return this.constructor.name
  }

  public isEventHandler(): this is IEventHandler {
    return "event" in this
  }

  public isTextCommandHandler(): this is ITextCommandHandler {
    return "text" in this
  }

  public isInteractionHandler(): this is
    | ISlashCommandHandler
    | IButtonHandler
    | ISelectMenuHandler
    | IUserContextHandler
    | IMessageContextHandler
    | IModalHandler {
    return (
      this.isSlashCommandHandler() ||
      this.isButtonHandler() ||
      this.isSelectMenuHandler() ||
      this.isUserContextHandler() ||
      this.isMessageContextHandler() ||
      this.isModalHandler()
    )
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
