import { AnySelectMenuInteraction } from "discord.js"
import { IDiscordHandler } from "./DiscordHandler"
import { BaseHandler } from "./BaseHandler"

export type SelectMenuArgs = {
  name: string
}

export type SelectMenuConstructor<T extends IDiscordHandler = IDiscordHandler> =
  SelectMenuArgs & {
    new (): BaseSelectMenu<T>
  }

export interface ISelectMenuHandler<
  T extends IDiscordHandler = IDiscordHandler
> {
  select: SelectMenuConstructor<T>
}

export abstract class BaseSelectMenu<
  T extends IDiscordHandler = IDiscordHandler
> extends BaseHandler<T> {
  public readonly name: string

  public constructor(handler: T, name: string) {
    super(handler)
    this.name = name
  }

  public abstract run(interaction: AnySelectMenuInteraction): Promise<void>
}

export default function SelectMenu<T extends IDiscordHandler = IDiscordHandler>(
  handler: T,
  name: string
): SelectMenuConstructor<T> {
  const base = BaseSelectMenu as new (
    handler: T,
    name: string
  ) => BaseSelectMenu<T>
  const ctor = base.bind(null, handler, name) as SelectMenuConstructor<T>

  ctor.name = name

  return ctor
}
