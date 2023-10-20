import { ButtonInteraction } from "discord.js"
import { IDiscordHandler } from "./DiscordHandler"
import { BaseHandler } from "./BaseHandler"

export type ButtonArgs = {
  name: string
}

export type ButtonConstructor<T extends IDiscordHandler = IDiscordHandler> =
  ButtonArgs & {
    new (): BaseButton<T>
  }

export interface IButtonHandler<T extends IDiscordHandler = IDiscordHandler> {
  button: ButtonConstructor<T>
}

export abstract class BaseButton<
  T extends IDiscordHandler = IDiscordHandler
> extends BaseHandler<T> {
  public readonly name: string

  public constructor(handler: T, name: string) {
    super(handler)
    this.name = name
  }

  public abstract run(interaction: ButtonInteraction): Promise<void>
}

export default function Button<T extends IDiscordHandler = IDiscordHandler>(
  handler: T,
  name: string
): ButtonConstructor<T> {
  const base = BaseButton as new (handler: T, name: string) => BaseButton<T>
  const ctor = base.bind(null, handler, name) as ButtonConstructor<T>

  ctor.name = name

  return ctor
}
