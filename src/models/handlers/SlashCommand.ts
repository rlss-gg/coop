import { ChatInputCommandInteraction } from "discord.js"
import { IDiscordHandler } from "./DiscordHandler"
import { BaseHandler } from "./BaseHandler"

export type SlashCommandArgs = {
  name: string
}

export type SlashCommandConstructor<
  T extends IDiscordHandler = IDiscordHandler
> = SlashCommandArgs & {
  new (): BaseSlashCommand<T>
}

export interface ISlashCommandHandler<
  T extends IDiscordHandler = IDiscordHandler
> {
  slash: SlashCommandConstructor<T>
}

export abstract class BaseSlashCommand<
  T extends IDiscordHandler = IDiscordHandler
> extends BaseHandler<T> {
  public readonly name: string

  public constructor(handler: T, name: string) {
    super(handler)
    this.name = name
  }

  public abstract run(interaction: ChatInputCommandInteraction): Promise<void>
}

export default function SlashCommand<
  T extends IDiscordHandler = IDiscordHandler
>(handler: T, name: string): SlashCommandConstructor<T> {
  const base = BaseSlashCommand as new (
    handler: T,
    name: string
  ) => BaseSlashCommand<T>
  const ctor = base.bind(null, handler, name) as SlashCommandConstructor<T>

  ctor.name = name

  return ctor
}
