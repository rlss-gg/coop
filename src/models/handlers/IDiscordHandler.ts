import IButtonHandler from "./IButtonHandler"
import IEventHandler from "./IEventHandler"
import IMessageContextHandler from "./IMessageContextHandler"
import IModalHandler from "./IModalHandler"
import ISelectMenuHandler from "./ISelectMenuHandler"
import ISlashCommandHandler from "./ISlashCommandHandler"
import ITextCommandHandler from "./ITextCommandHandler"
import IUserContextHandler from "./IUserContextHandler"

export default interface IDiscordHandler {
  readonly name: string

  isEventHandler(): this is IEventHandler

  isTextCommandHandler(): this is ITextCommandHandler

  isSlashCommandHandler(): this is ISlashCommandHandler

  isButtonHandler(): this is IButtonHandler

  isSelectMenuHandler(): this is ISelectMenuHandler

  isUserContextHandler(): this is IUserContextHandler

  isMessageContextHandler(): this is IMessageContextHandler

  isModalHandler(): this is IModalHandler
}
