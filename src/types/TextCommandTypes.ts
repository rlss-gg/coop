import TextCommand from "../models/handlers/TextCommand"
import IConfiguration from "../models/configuration/IConfiguration"
import ILogger from "../models/logger/ILogger"

export namespace TextCommandTypes {
  export type Collection = Record<string, TextCommand>

  export type Constructor<T extends TextCommand> = new (
    configuration: IConfiguration,
    logger: ILogger
  ) => T
}
