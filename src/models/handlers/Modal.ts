import { ModalSubmitInteraction } from "discord.js"
import { IDiscordHandler } from "./DiscordHandler"
import { BaseHandler } from "./BaseHandler"

export type ModalArgs = {
  name: string
}

export type ModalConstructor<T extends IDiscordHandler = IDiscordHandler> =
  ModalArgs & {
    new (): BaseModal<T>
  }

export interface IModalHandler<T extends IDiscordHandler = IDiscordHandler> {
  modal: ModalConstructor<T>
}

export abstract class BaseModal<
  T extends IDiscordHandler = IDiscordHandler
> extends BaseHandler<T> {
  public readonly name: string

  public constructor(handler: T, name: string) {
    super(handler)
    this.name = name
  }

  public abstract run(interaction: ModalSubmitInteraction): Promise<void>
}

export default function Modal<T extends IDiscordHandler = IDiscordHandler>(
  handler: T,
  name: string
): ModalConstructor<T> {
  const base = BaseModal as new (handler: T, name: string) => BaseModal<T>
  const ctor = base.bind(null, handler, name) as ModalConstructor<T>

  ctor.name = name

  return ctor
}
