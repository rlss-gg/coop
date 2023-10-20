import { IDiscordHandler } from "../models/handlers/DiscordHandler"

export namespace HandlerTypes {
  export type Constructor = new () => IDiscordHandler

  export type Collection = Record<string, IDiscordHandler>

  export namespace Events {
    export type Occurrance = "on" | "once"
  }
}
