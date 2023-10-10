import { PrismaClient } from "@prisma/client"
import { Client as DjsClient } from "discord.js"
import IConfiguration from "../../models/configuration/IConfiguration"
import ILogger from "../../models/logger/ILogger"
import { HandlerTypes } from "../../types/HandlerTypes"
import ITextCommandHandler from "../../models/handlers/ITextCommandHandler"
import DuplicateKeyError from "../../errors/DuplicateKeyError"

export default class DiscordClient {
  private readonly _configuration: IConfiguration
  private readonly _logger: ILogger
  private readonly _prismaClient: PrismaClient
  private readonly _djsClient: DjsClient<true>

  public constructor(
    configuration: IConfiguration,
    logger: ILogger,
    prismaClient: PrismaClient,
    djsClient: DjsClient,
    handlers: HandlerTypes.Collection
  ) {
    // Setup dependencies
    this._configuration = configuration
    this._logger = logger
    this._prismaClient = prismaClient
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
        this._djsClient[handler.eventDetails.occurrance](
          handler.eventDetails.name,
          async (...args: any[]) =>
            await handler.event(this, this._prismaClient, ...args)
        )

        types.push("Event: " + handler.eventDetails.name)
      }

      if (handler.isTextCommandHandler()) {
        if (textCommands[handler.textDetails.name])
          throw new DuplicateKeyError(name)
        textCommands[handler.textDetails.name] = handler

        types.push("Text Command")
      }

      if (handler.isSlashCommandHandler()) {
        // TODO

        types.push("Slash Command")
      }

      if (handler.isButtonHandler()) {
        // TODO

        types.push("Button")
      }

      if (handler.isSelectMenuHandler()) {
        // TODO

        types.push("Select Menu")
      }

      if (handler.isUserContextHandler()) {
        // TODO

        types.push("User Context")
      }

      if (handler.isMessageContextHandler()) {
        // TODO

        types.push("Message Context")
      }

      if (handler.isModalHandler()) {
        // TODO

        types.push("Modal")
      }

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
        await textCommands[command].text(
          this,
          this._prismaClient,
          message,
          ...args.slice(1)
        )
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
