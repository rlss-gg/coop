import { MessageContextMenuCommandInteraction } from "discord.js"
import { IDiscordHandler } from "./DiscordHandler"
import { BaseHandler } from "./BaseHandler"

export type MessageContextArgs = {
  name: string
}

export type MessageContextConstructor<
  T extends IDiscordHandler = IDiscordHandler
> = MessageContextArgs & {
  new (): BaseMessageContext<T>
}

export interface IMessageContextHandler<
  T extends IDiscordHandler = IDiscordHandler
> {
  contextMessage: MessageContextConstructor<T>
}

export abstract class BaseMessageContext<
  T extends IDiscordHandler = IDiscordHandler
> extends BaseHandler<T> {
  public readonly name: string

  public constructor(handler: T, name: string) {
    super(handler)
    this.name = name
  }

  public abstract run(
    interaction: MessageContextMenuCommandInteraction
  ): Promise<void>
}

export default function MessageContext<
  T extends IDiscordHandler = IDiscordHandler
>(handler: T, name: string): MessageContextConstructor<T> {
  const base = BaseMessageContext as new (
    handler: T,
    name: string
  ) => BaseMessageContext<T>
  const ctor = base.bind(null, handler, name) as MessageContextConstructor<T>

  ctor.name = name

  return ctor
}
