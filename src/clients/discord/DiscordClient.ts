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
  private readonly _loggerFactory!: ILoggerFactory
  protected readonly _logger: ILogger

  @Inject("prismaClientFactory")
  private readonly _prismaClientFactory!: PrismaClientFactory
  protected readonly _prismaClient: PrismaClient

  protected readonly _djsClient: DjsClient<true>

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
          handler.event.type,
          async (...args: any[]) => {
            this._logger.log(
              "DEBUG",
              `Handling ${handler.event.type} event in ${name}...`
            )
            await new handler.event().run(...args)
          }
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
        else if (handler.isStringSelectMenuHandler())
          types.push("String select menu: " + handler.selectString.name)
        else if (handler.isChannelSelectMenuHandler())
          types.push("Channel select menu: " + handler.selectChannel.name)
        else if (handler.isUserSelectMenuHandler())
          types.push("User select menu: " + handler.selectUser.name)
        else if (handler.isRoleSelectMenuHandler())
          types.push("Role select menu: " + handler.selectRole.name)
        else if (handler.isMentionableSelectMenuHandler())
          types.push(
            "Mentionable select menu: " + handler.selectMentionable.name
          )
        else if (handler.isUserContextHandler())
          types.push("User context: " + handler.contextUser.name)
        else if (handler.isMessageContextHandler())
          types.push("Message context: " + handler.contextMessage.name)
        else if (handler.isModalHandler())
          types.push("Modal: " + handler.modal.name)
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
      ) {
        this._logger.log("DEBUG", `Running command ${command}...`)
        await new textCommands[command].text().run(message, ...args.slice(1))
      }
    })

    // Create event to handle interactions
    this._djsClient.on("interactionCreate", async interaction => {
      // Test all different types of interaction
      for (const handler of interactions) {
        if (
          interaction.isChatInputCommand() &&
          handler.isSlashCommandHandler() &&
          interaction.commandName == handler.slash.name
        ) {
          this._logger.log(
            "DEBUG",
            `Handling slash command ${handler.slash.name}...`
          )
          return new handler.slash().run(interaction)
        } else if (
          interaction.isButton() &&
          handler.isButtonHandler() &&
          interaction.customId == handler.button.name
        ) {
          this._logger.log("DEBUG", `Handling button ${handler.button.name}...`)
          return new handler.button().run(interaction)
        } else if (
          interaction.isStringSelectMenu() &&
          handler.isStringSelectMenuHandler() &&
          interaction.customId == handler.selectString.name
        ) {
          this._logger.log(
            "DEBUG",
            `Handling string select menu ${handler.selectString.name}...`
          )
          return new handler.selectString().run(interaction)
        } else if (
          interaction.isChannelSelectMenu() &&
          handler.isChannelSelectMenuHandler() &&
          interaction.customId == handler.selectChannel.name
        ) {
          this._logger.log(
            "DEBUG",
            `Handling channel select menu ${handler.selectChannel.name}...`
          )
          return new handler.selectChannel().run(interaction)
        } else if (
          interaction.isUserSelectMenu() &&
          handler.isUserSelectMenuHandler() &&
          interaction.customId == handler.selectUser.name
        ) {
          this._logger.log(
            "DEBUG",
            `Handling user select menu ${handler.selectUser.name}...`
          )
          return new handler.selectUser().run(interaction)
        } else if (
          interaction.isRoleSelectMenu() &&
          handler.isRoleSelectMenuHandler() &&
          interaction.customId == handler.selectRole.name
        ) {
          this._logger.log(
            "DEBUG",
            `Handling role select menu ${handler.selectRole.name}...`
          )
          return new handler.selectRole().run(interaction)
        } else if (
          interaction.isMentionableSelectMenu() &&
          handler.isMentionableSelectMenuHandler() &&
          interaction.customId == handler.selectMentionable.name
        ) {
          this._logger.log(
            "DEBUG",
            `Handling mentionable select menu ${handler.selectMentionable.name}...`
          )
          return new handler.selectMentionable().run(interaction)
        } else if (
          interaction.isUserContextMenuCommand() &&
          handler.isUserContextHandler() &&
          interaction.commandName == handler.contextUser.name
        ) {
          this._logger.log(
            "DEBUG",
            `Handling user context ${handler.contextUser.name}...`
          )
          return new handler.contextUser().run(interaction)
        } else if (
          interaction.isMessageContextMenuCommand() &&
          handler.isMessageContextHandler() &&
          interaction.commandName == handler.contextMessage.name
        ) {
          this._logger.log(
            "DEBUG",
            `Handling message context ${handler.contextMessage.name}...`
          )
          return new handler.contextMessage().run(interaction)
        } else if (
          interaction.isModalSubmit() &&
          handler.isModalHandler() &&
          interaction.customId == handler.modal.name
        ) {
          this._logger.log("DEBUG", `Handling modal ${handler.modal.name}...`)
          return new handler.modal().run(interaction)
        }

        // If no interaction was run throw an error
        throw new InteractionNotHandledError(interaction.id)
      }
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
