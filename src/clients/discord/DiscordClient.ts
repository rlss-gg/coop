import { PrismaClient } from "@prisma/client"
import { Client as DjsClient } from "discord.js"
import IConfiguration from "../../models/configuration/IConfiguration"
import ILogger from "../../models/logger/ILogger"
import { HandlerTypes } from "../../types/HandlerTypes"
import DuplicateKeyError from "../../errors/DuplicateKeyError"
import Inject from "../../decorators/di/Inject"
import ILoggerFactory from "../../factories/logger/ILoggerFactory"
import PrismaClientFactory from "../../factories/database/PrismaClientFactory"
import { ITextCommandHandler } from "../../models/handlers/TextCommand"

export default class DiscordClient {
  @Inject("configuration")
  protected readonly _configuration!: IConfiguration

  @Inject("loggerFactory")
  protected readonly _loggerFactory!: ILoggerFactory
  protected readonly _logger: ILogger

  @Inject("prismaClientFactory")
  protected readonly _prismaClientFactory!: PrismaClientFactory
  protected readonly _prismaClient: PrismaClient

  private readonly _djsClient: DjsClient<true>

  public constructor(djsClient: DjsClient, handlers: HandlerTypes.Collection) {
    // Setup dependencies
    this._logger = this._loggerFactory.createLogger()
    this._prismaClient = this._prismaClientFactory.createClient()

    this._djsClient = djsClient

    // Get prefix from configuration
    const prefix = this._configuration.get("prefix")
    this._logger.log("DEBUG", `Setup text commands using the prefix: ${prefix}`)

    // Setup handlers
    const textCommands: Record<string, ITextCommandHandler> = {}

    Object.entries(handlers).forEach(([name, handler]) => {
      const types: string[] = []

      // Setup events
      if (handler.isEventHandler()) {
        this._djsClient[handler.event.occurrance](
          handler.event.name,
          async (...args: any[]) => await new handler.event().run(...args)
        )

        types.push("Event: " + handler.event.name)
      }

      if (handler.isTextCommandHandler()) {
        if (textCommands[handler.text.trigger])
          throw new DuplicateKeyError(name)
        textCommands[handler.text.trigger] = handler

        types.push("Text Command")
      }

      // if (handler.isSlashCommandHandler()) {
      //   // TODO

      //   types.push("Slash Command")
      // }

      // if (handler.isButtonHandler()) {
      //   // TODO

      //   types.push("Button")
      // }

      // if (handler.isSelectMenuHandler()) {
      //   // TODO

      //   types.push("Select Menu")
      // }

      // if (handler.isUserContextHandler()) {
      //   // TODO

      //   types.push("User Context")
      // }

      // if (handler.isMessageContextHandler()) {
      //   // TODO

      //   types.push("Message Context")
      // }

      // if (handler.isModalHandler()) {
      //   // TODO

      //   types.push("Modal")
      // }

      // Log configured handlers
      const list = ["", ...types.map(type => `- ${type}`)].join("\r\n")
      this._logger.log("DEBUG", `Configured handler ${name}: ${list}`)
    })

    // Create event to handle text commands
    this._djsClient.on("messageCreate", async message => {
      const args = message.content.trim().split(" ")
      const command = args[0].substring(1, args[0].length)

      if (
        args[0].startsWith("!") &&
        Object.keys(textCommands).includes(command)
      )
        await new textCommands[command].text().run(message, ...args.slice(1))
    })
  }

  public start(
    callback: (
      client: DjsClient<true>,
      configuration: IConfiguration,
      logger: ILogger
    ) => void
  ): void {
    this._djsClient.once("ready", (client: DjsClient<true>) =>
      callback(client, this._configuration, this._logger)
    )

    this._djsClient.login(this._configuration.get("DISCORD_BOT_TOKEN"))
  }
}
