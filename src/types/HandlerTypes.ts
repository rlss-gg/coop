import { ClientEvents } from "discord.js"
import IConfiguration from "../models/configuration/IConfiguration"
import ILogger from "../models/logger/ILogger"
import IDiscordHandler from "../models/handlers/IDiscordHandler"

export namespace HandlerTypes {
  export type Constructor = new (
    configuration: IConfiguration,
    logger: ILogger
  ) => IDiscordHandler

  export type Collection = Record<string, IDiscordHandler>

  export namespace Events {
    export type Occurrance = "on" | "once"

    export type Details = {
      occurrance: Occurrance
      name: keyof ClientEvents
    }
  }

  export namespace TextCommands {
    export type Details = {
      name: string
    }
  }
}
