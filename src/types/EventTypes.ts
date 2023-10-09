import { Events } from "discord.js"
import Event from "../models/handlers/Event"
import IConfiguration from "../models/configuration/IConfiguration"
import ILogger from "../models/logger/ILogger"

export namespace EventTypes {
  export type Collection = { [K in Events]?: Event[] }

  export type Type = "on" | "once"

  export type Constructor<T extends Event> = new (
    configuration: IConfiguration,
    logger: ILogger
  ) => T
}
