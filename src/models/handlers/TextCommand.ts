import { BaseHandler } from "./BaseHandler"
import { Message } from "discord.js"
import { IDiscordHandler } from "./DiscordHandler"

export type TextCommandArgs = {
  trigger: string
}

export type TextCommandConstructor<
  T extends IDiscordHandler = IDiscordHandler
> = TextCommandArgs & {
  new (): BaseTextCommand<T>
}

export interface ITextCommandHandler<
  T extends IDiscordHandler = IDiscordHandler
> {
  text: TextCommandConstructor<T>
}

export abstract class BaseTextCommand<
  T extends IDiscordHandler = IDiscordHandler
> extends BaseHandler<T> {
  public readonly trigger: string

  public constructor(handler: T, trigger: string) {
    super(handler)
    this.trigger = trigger
  }

  public abstract run(message: Message, ...args: string[]): Promise<void>
}

export default function TextCommand<
  T extends IDiscordHandler = IDiscordHandler
>(handler: T, trigger: string): TextCommandConstructor<T> {
  const base = BaseTextCommand as new (
    handler: T,
    trigger: string
  ) => BaseTextCommand<T>
  const ctor = base.bind(null, handler, trigger) as TextCommandConstructor<T>

  ctor.trigger = trigger

  return ctor
}


