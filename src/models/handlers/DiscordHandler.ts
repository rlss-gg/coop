import Inject from "../../decorators/di/Inject"
import PrismaClientFactory from "../../factories/database/PrismaClientFactory"
import ILoggerFactory from "../../factories/logger/ILoggerFactory"
import IConfiguration from "../configuration/IConfiguration"
import { IButtonHandler } from "./Button"
import { IChannelSelectMenuHandler } from "./ChannelSelectMenu"
import { IEventHandler } from "./Event"
import { IMentionableSelectMenuHandler } from "./MentionableSelectMenu"
import { IMessageContextHandler } from "./MessageContext"
import { IModalHandler } from "./Modal"
import { IRoleSelectMenuHandler } from "./RoleSelectMenu"
import { ISlashCommandHandler } from "./SlashCommand"
import { IStringSelectMenuHandler } from "./StringSelectMenu"
import { ITextCommandHandler } from "./TextCommand"
import { IUserContextHandler } from "./UserContext"
import { IUserSelectMenuHandler } from "./UserSelectMenu"

export interface IDiscordHandler {
  readonly name: string

  isEventHandler(): this is IEventHandler

  isTextCommandHandler(): this is ITextCommandHandler

  isInteractionHandler(): this is
    | ISlashCommandHandler
    | IButtonHandler
    | IStringSelectMenuHandler
    | IChannelSelectMenuHandler
    | IUserSelectMenuHandler
    | IRoleSelectMenuHandler
    | IMentionableSelectMenuHandler
    | IUserContextHandler
    | IMessageContextHandler
    | IModalHandler

  isSlashCommandHandler(): this is ISlashCommandHandler

  isButtonHandler(): this is IButtonHandler

  isSelectMenuHandler(): this is
    | IStringSelectMenuHandler
    | IChannelSelectMenuHandler
    | IUserSelectMenuHandler
    | IRoleSelectMenuHandler
    | IMentionableSelectMenuHandler

  isStringSelectMenuHandler(): this is IStringSelectMenuHandler

  isChannelSelectMenuHandler(): this is IChannelSelectMenuHandler

  isUserSelectMenuHandler(): this is IUserSelectMenuHandler

  isRoleSelectMenuHandler(): this is IRoleSelectMenuHandler

  isMentionableSelectMenuHandler(): this is IMentionableSelectMenuHandler

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
    | IStringSelectMenuHandler
    | IChannelSelectMenuHandler
    | IUserSelectMenuHandler
    | IRoleSelectMenuHandler
    | IMentionableSelectMenuHandler
    | IUserContextHandler
    | IMessageContextHandler
    | IModalHandler {
    return (
      this.isSlashCommandHandler() ||
      this.isButtonHandler() ||
      this.isStringSelectMenuHandler() ||
      this.isChannelSelectMenuHandler() ||
      this.isUserSelectMenuHandler() ||
      this.isRoleSelectMenuHandler() ||
      this.isMentionableSelectMenuHandler() ||
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

  public isSelectMenuHandler(): this is
    | IStringSelectMenuHandler
    | IChannelSelectMenuHandler
    | IUserSelectMenuHandler
    | IRoleSelectMenuHandler
    | IMentionableSelectMenuHandler {
    return (
      this.isStringSelectMenuHandler() ||
      this.isChannelSelectMenuHandler() ||
      this.isUserSelectMenuHandler() ||
      this.isRoleSelectMenuHandler() ||
      this.isMentionableSelectMenuHandler()
    )
  }

  public isStringSelectMenuHandler(): this is IStringSelectMenuHandler {
    return "selectString" in this
  }

  public isChannelSelectMenuHandler(): this is IChannelSelectMenuHandler {
    return "selectChannel" in this
  }

  public isUserSelectMenuHandler(): this is IUserSelectMenuHandler {
    return "selectUser" in this
  }

  public isRoleSelectMenuHandler(): this is IRoleSelectMenuHandler {
    return "selectRole" in this
  }

  public isMentionableSelectMenuHandler(): this is IMentionableSelectMenuHandler {
    return "selectMentionable" in this
  }

  public isContextHandler(): this is
    | IUserContextHandler
    | IMessageContextHandler {
    return this.isUserContextHandler() || this.isMessageContextHandler()
  }

  public isUserContextHandler(): this is IUserContextHandler {
    return "contextUser" in this
  }

  public isMessageContextHandler(): this is IMessageContextHandler {
    return "contextMessage" in this
  }

  public isModalHandler(): this is IModalHandler {
    return "modal" in this
  }
}
