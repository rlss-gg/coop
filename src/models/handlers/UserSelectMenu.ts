import { UserSelectMenuInteraction } from "discord.js"
import { IDiscordHandler } from "./DiscordHandler"
import { BaseHandler } from "./BaseHandler"

export type UserSelectMenuArgs = {
  name: string
}

export type UserSelectMenuConstructor<
  T extends IDiscordHandler = IDiscordHandler
> = UserSelectMenuArgs & {
  new (): BaseUserSelectMenu<T>
}

export interface IUserSelectMenuHandler<
  T extends IDiscordHandler = IDiscordHandler
> {
  selectUser: UserSelectMenuConstructor<T>
}

export abstract class BaseUserSelectMenu<
  T extends IDiscordHandler = IDiscordHandler
> extends BaseHandler<T> {
  public readonly name: string

  public constructor(handler: T, name: string) {
    super(handler)
    this.name = name
  }

  public abstract run(interaction: UserSelectMenuInteraction): Promise<void>
}

export default function UserSelectMenu<
  T extends IDiscordHandler = IDiscordHandler
>(handler: T, name: string): UserSelectMenuConstructor<T> {
  const base = BaseUserSelectMenu as new (
    handler: T,
    name: string
  ) => BaseUserSelectMenu<T>
  const ctor = base.bind(null, handler, name) as UserSelectMenuConstructor<T>

  ctor.name = name

  return ctor
}
