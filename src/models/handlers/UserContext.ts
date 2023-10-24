import { UserContextMenuCommandInteraction } from "discord.js"
import { IDiscordHandler } from "./DiscordHandler"
import { BaseHandler } from "./BaseHandler"

export type UserContextArgs = {
  name: string
}

export type UserContextConstructor<
  T extends IDiscordHandler = IDiscordHandler
> = UserContextArgs & {
  new (): BaseUserContext<T>
}

export interface IUserContextHandler<
  T extends IDiscordHandler = IDiscordHandler
> {
  contextUser: UserContextConstructor<T>
}

export abstract class BaseUserContext<
  T extends IDiscordHandler = IDiscordHandler
> extends BaseHandler<T> {
  public readonly name: string

  public constructor(handler: T, name: string) {
    super(handler)
    this.name = name
  }

  public abstract run(
    interaction: UserContextMenuCommandInteraction
  ): Promise<void>
}

export default function UserContext<
  T extends IDiscordHandler = IDiscordHandler
>(handler: T, name: string): UserContextConstructor<T> {
  const base = BaseUserContext as new (
    handler: T,
    name: string
  ) => BaseUserContext<T>
  const ctor = base.bind(null, handler, name) as UserContextConstructor<T>

  ctor.name = name

  return ctor
}
