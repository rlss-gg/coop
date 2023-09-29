import { ILoggerTypes } from "../types/ILoggerTypes"
import ILogger from "./ILogger"

export default class ConsoleLogger implements ILogger {
  public log(level: ILoggerTypes.LogLevel, message: string): void {
    const content = `[${new Date().toISOString()}] (${level}) ${message}`

    switch (level) {
      case "INFO":
        console.info(content)
      case "WARNING":
        console.warn(content)
      case "CRITICAL":
        console.error(content)
      case "DEBUG":
        console.log(content)
    }
  }
}
