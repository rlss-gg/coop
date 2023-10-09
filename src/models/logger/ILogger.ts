import { ILoggerTypes } from "../../types/ILoggerTypes"

export default interface ILogger {
  /**
   * Log a message to the logger.
   * @param level The level of severity for the log
   * @param message The message to log
   */
  log: (level: ILoggerTypes.LogLevel, message: string) => void
}
