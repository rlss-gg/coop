import { StringSelectMenuInteraction } from "discord.js"
import { IDiscordHandler } from "./DiscordHandler"
import { BaseHandler } from "./BaseHandler"

export type StringSelectMenuArgs = {
  name: string
}

export type StringSelectMenuConstructor<
  T extends IDiscordHandler = IDiscordHandler
> = StringSelectMenuArgs & {
  new (): BaseStringSelectMenu<T>
}

export interface IStringSelectMenuHandler<
  T extends IDiscordHandler = IDiscordHandler
> {
  selectString: StringSelectMenuConstructor<T>
}

export abstract class BaseStringSelectMenu<
  T extends IDiscordHandler = IDiscordHandler
> extends BaseHandler<T> {
  public readonly name: string

  public constructor(handler: T, name: string) {
    super(handler)
    this.name = name
  }

  public abstract run(interaction: StringSelectMenuInteraction): Promise<void>
}

export default function StringSelectMenu<
  T extends IDiscordHandler = IDiscordHandler
>(handler: T, name: string): StringSelectMenuConstructor<T> {
  const base = BaseStringSelectMenu as new (
    handler: T,
    name: string
  ) => BaseStringSelectMenu<T>
  const ctor = base.bind(null, handler, name) as StringSelectMenuConstructor<T>

  ctor.name = name

  return ctor
}
