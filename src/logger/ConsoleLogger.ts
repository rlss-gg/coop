import { ILoggerTypes } from "../types/ILoggerTypes"
import ILogger from "./ILogger"

export default class ConsoleLogger implements ILogger {
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
        console.log(content)
        break
    }
  }
}
