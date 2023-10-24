import { MentionableSelectMenuInteraction } from "discord.js"
import { IDiscordHandler } from "./DiscordHandler"
import { BaseHandler } from "./BaseHandler"

export type MentionableSelectMenuArgs = {
  name: string
}

export type MentionableSelectMenuConstructor<
  T extends IDiscordHandler = IDiscordHandler
> = MentionableSelectMenuArgs & {
  new (): BaseMentionableSelectMenu<T>
}

export interface IMentionableSelectMenuHandler<
  T extends IDiscordHandler = IDiscordHandler
> {
  selectMentionable: MentionableSelectMenuConstructor<T>
}

export abstract class BaseMentionableSelectMenu<
  T extends IDiscordHandler = IDiscordHandler
> extends BaseHandler<T> {
  public readonly name: string

  public constructor(handler: T, name: string) {
    super(handler)
    this.name = name
  }

  public abstract run(
    interaction: MentionableSelectMenuInteraction
  ): Promise<void>
}

export default function MentionableSelectMenu<
  T extends IDiscordHandler = IDiscordHandler
>(handler: T, name: string): MentionableSelectMenuConstructor<T> {
  const base = BaseMentionableSelectMenu as new (
    handler: T,
    name: string
  ) => BaseMentionableSelectMenu<T>
  const ctor = base.bind(
    null,
    handler,
    name
  ) as MentionableSelectMenuConstructor<T>

  ctor.name = name

  return ctor
}
