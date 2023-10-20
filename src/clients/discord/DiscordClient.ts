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
import { IDiscordHandler } from "../../models/handlers/DiscordHandler"
import InteractionNotHandledError from "../../errors/InteractionNotHandledError"

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
    const interactions: IDiscordHandler[] = []

    Object.entries(handlers).forEach(([name, handler]) => {
      const types: string[] = []

      // Setup events
      if (handler.isEventHandler()) {
        this._djsClient[handler.event.occurrance](
          handler.event.name,
          async (...args: any[]) => await new handler.event().run(...args)
        )

        types.push("Event: " + handler.event.type)
      }

      // Setup text commands
      if (handler.isTextCommandHandler()) {
        if (textCommands[handler.text.trigger])
          throw new DuplicateKeyError(name)
        textCommands[handler.text.trigger] = handler

        types.push("Text command: " + handler.text.trigger)
      }

      // Setup interactions
      if (handler.isInteractionHandler()) {
        interactions.push(handler)

        if (handler.isSlashCommandHandler())
          types.push("Slash command: " + handler.slash.name)
        else if (handler.isButtonHandler())
          types.push("Button: " + handler.button.name)
        else if (handler.isSelectMenuHandler())
          types.push("Select menu: " + handler.select.name)
        else if (handler.isUserContextHandler())
          types.push("User context: " + handler.user.name)
        else if (handler.isMessageContextHandler())
          types.push("Message context: " + handler.message.name)
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
        await new textCommands[command].text().run(message, ...args.slice(1))
    })

    // Create event to handle interactions
    this._djsClient.on("interactionCreate", async interaction => {
      // Test all different types of interaction
      for (const handler of interactions) {
        if (
          interaction.isChatInputCommand() &&
          handler.isSlashCommandHandler() &&
          interaction.commandName == handler.slash.name
        )
          return new handler.slash().run(interaction)
        else if (
          interaction.isButton() &&
          handler.isButtonHandler() &&
          interaction.customId == handler.button.name
        )
          return new handler.button().run(interaction)
        else if (
          interaction.isAnySelectMenu() &&
          handler.isSelectMenuHandler() &&
          interaction.customId == handler.select.name
        )
          return new handler.select().run(interaction)
        else if (
          interaction.isUserContextMenuCommand() &&
          handler.isUserContextHandler() &&
          interaction.commandName == handler.user.name
        )
          return new handler.user().run(interaction)
        else if (
          interaction.isMessageContextMenuCommand() &&
          handler.isMessageContextHandler() &&
          interaction.commandName == handler.message.name
        )
          return new handler.message().run(interaction)
        else if (
          interaction.isModalSubmit() &&
          handler.isModalHandler() &&
          interaction.customId == handler.modal.name
        )
          return new handler.modal().run(interaction)
      }

      // If no interaction was run throw an error
      throw new InteractionNotHandledError(interaction.id)
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
