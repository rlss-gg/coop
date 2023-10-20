import { ClientEvents } from "discord.js"
import { HandlerTypes } from "../../types/HandlerTypes"
import { BaseHandler } from "./BaseHandler"
import { IDiscordHandler } from "./DiscordHandler"

export type EventArgs = {
  occurrance: HandlerTypes.Events.Occurrance
  type: keyof ClientEvents
}

export type EventConstructor<T extends IDiscordHandler = IDiscordHandler> =
  EventArgs & {
    new (): BaseEvent<T>
  }

export interface IEventHandler<T extends IDiscordHandler = IDiscordHandler> {
  event: EventConstructor<T>
}

export abstract class BaseEvent<
  T extends IDiscordHandler = IDiscordHandler
> extends BaseHandler<T> {
  public readonly occurrance: HandlerTypes.Events.Occurrance
  public readonly type: keyof ClientEvents

  public constructor(
    handler: T,
    occurrance: HandlerTypes.Events.Occurrance,
    type: keyof ClientEvents
  ) {
    super(handler)
    this.occurrance = occurrance
    this.type = type
  }

  public abstract run(...args: any[]): Promise<void>
}

export default function Event<T extends IDiscordHandler = IDiscordHandler>(
  handler: T,
  occurrance: HandlerTypes.Events.Occurrance,
  type: keyof ClientEvents
): EventConstructor<T> {
  const base = BaseEvent as new (
    handler: T,
    occurrance: HandlerTypes.Events.Occurrance,
    type: keyof ClientEvents
  ) => BaseEvent<T>
  const ctor = base.bind(null, handler, occurrance, type) as EventConstructor<T>

  ctor.occurrance = occurrance
  ctor.type = type

  return ctor
}
