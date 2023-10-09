import ConsoleLogger from "../../models/logger/ConsoleLogger"
import ILoggerFactory from "./ILoggerFactory"
import ILogger from "../../models/logger/ILogger"

export default class ConsoleLoggerFactory implements ILoggerFactory {
  public createLogger(): ILogger {
    return new ConsoleLogger()
  }
}
