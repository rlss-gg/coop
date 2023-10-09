import ILogger from "../../models/logger/ILogger"

export default interface ILoggerFactory {
  createLogger(): ILogger
}
