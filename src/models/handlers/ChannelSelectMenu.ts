import { ChannelSelectMenuInteraction } from "discord.js"
import { IDiscordHandler } from "./DiscordHandler"
import { BaseHandler } from "./BaseHandler"

export type ChannelSelectMenuArgs = {
  name: string
}

export type ChannelSelectMenuConstructor<
  T extends IDiscordHandler = IDiscordHandler
> = ChannelSelectMenuArgs & {
  new (): BaseChannelSelectMenu<T>
}

export interface IChannelSelectMenuHandler<
  T extends IDiscordHandler = IDiscordHandler
> {
  selectChannel: ChannelSelectMenuConstructor<T>
}

export abstract class BaseChannelSelectMenu<
  T extends IDiscordHandler = IDiscordHandler
> extends BaseHandler<T> {
  public readonly name: string

  public constructor(handler: T, name: string) {
    super(handler)
    this.name = name
  }

  public abstract run(interaction: ChannelSelectMenuInteraction): Promise<void>
}

export default function ChannelSelectMenu<
  T extends IDiscordHandler = IDiscordHandler
>(handler: T, name: string): ChannelSelectMenuConstructor<T> {
  const base = BaseChannelSelectMenu as new (
    handler: T,
    name: string
  ) => BaseChannelSelectMenu<T>
  const ctor = base.bind(null, handler, name) as ChannelSelectMenuConstructor<T>

  ctor.name = name

  return ctor
}
