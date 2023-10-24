import { RoleSelectMenuInteraction } from "discord.js"
import { IDiscordHandler } from "./DiscordHandler"
import { BaseHandler } from "./BaseHandler"

export type RoleSelectMenuArgs = {
  name: string
}

export type RoleSelectMenuConstructor<
  T extends IDiscordHandler = IDiscordHandler
> = RoleSelectMenuArgs & {
  new (): BaseRoleSelectMenu<T>
}

export interface IRoleSelectMenuHandler<
  T extends IDiscordHandler = IDiscordHandler
> {
  selectRole: RoleSelectMenuConstructor<T>
}

export abstract class BaseRoleSelectMenu<
  T extends IDiscordHandler = IDiscordHandler
> extends BaseHandler<T> {
  public readonly name: string

  public constructor(handler: T, name: string) {
    super(handler)
    this.name = name
  }

  public abstract run(interaction: RoleSelectMenuInteraction): Promise<void>
}

export default function RoleSelectMenu<
  T extends IDiscordHandler = IDiscordHandler
>(handler: T, name: string): RoleSelectMenuConstructor<T> {
  const base = BaseRoleSelectMenu as new (
    handler: T,
    name: string
  ) => BaseRoleSelectMenu<T>
  const ctor = base.bind(null, handler, name) as RoleSelectMenuConstructor<T>

  ctor.name = name

  return ctor
}
