import Inject from "../../decorators/di/Inject"
import { ILoggerTypes } from "../../types/ILoggerTypes"
import IConfiguration from "../configuration/IConfiguration"
import ILogger from "./ILogger"

export default class ConsoleLogger implements ILogger {
  @Inject("configuration")
  protected readonly _configuration!: IConfiguration

  public log(level: ILoggerTypes.LogLevel, message: string): void {
    const metadata = `[${new Date().toISOString()}] (${level}) `
    const newline =
      "\r\n" +
      Array.from({ length: metadata.length })
        .map(() => " ")
        .join("")

    const content = metadata + message.replace(/\n/g, newline)

    switch (level) {
      case "INFO":
        console.info(content)
        break
      case "WARNING":
        console.warn(content)
        break
      case "CRITICAL":
        console.error(content)
        break
      case "DEBUG":
        if (this._configuration.get("debug") === "true") console.log(content)
        break
    }
  }
}
