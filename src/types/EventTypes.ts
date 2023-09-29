import { Events } from "discord.js"
import Event from "../client/models/Event"
import IConfiguration from "../configuration/IConfiguration"
import ILogger from "../logger/ILogger"

export namespace EventTypes {
  export type Collection = { [K in Events]?: Event[] }

  export type Type = "on" | "once"

  export type Constructor<T extends Event> = new (
    configuration: IConfiguration,
    logger: ILogger
  ) => T
}
