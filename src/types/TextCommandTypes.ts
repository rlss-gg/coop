import TextCommand from "../client/handlers/TextCommand"
import IConfiguration from "../configuration/IConfiguration"
import ILogger from "../logger/ILogger"

export namespace TextCommandTypes {
  export type Collection = Record<string, TextCommand>

  export type Constructor<T extends TextCommand> = new (
    configuration: IConfiguration,
    logger: ILogger
  ) => T
}
