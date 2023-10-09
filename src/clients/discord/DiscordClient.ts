import { PrismaClient } from "@prisma/client"
import { Client as DjsClient, Events } from "discord.js"
import IConfiguration from "../../models/configuration/IConfiguration"
import ILogger from "../../models/logger/ILogger"
import { EventTypes } from "../../types/EventTypes"
import { TextCommandTypes } from "../../types/TextCommandTypes"

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
    events: EventTypes.Collection,
    textCommands: TextCommandTypes.Collection
  ) {
    // Setup dependencies
    this._configuration = configuration
    this._logger = logger
    this._prismaClient = prismaClient
    this._djsClient = djsClient

    // Setup events
    Object.entries(events).forEach(([name, events]) => {
      const list = ["", ...events.map(event => `- ${event.name}`)].join("\r\n")
      this._logger.log("DEBUG", `Configuring ${name} events: ${list}`)

      events.forEach(event =>
        this._djsClient[event.type](name, (...args: any[]) =>
          event.handle(this, this._prismaClient, ...args)
        )
      )
    })

    // Setup text commands
    const prefix = this._configuration.get("prefix")
    this._logger.log("DEBUG", `Setup text commands using the prefix: ${prefix}`)

    {
      const commands = Object.keys(textCommands)
      const list = ["", ...commands.map(name => `- ${name}`)].join("\r\n")
      this._logger.log("DEBUG", `Configuring text commands: ${list}`)
    }

    this._djsClient.on(Events.MessageCreate, message => {
      const name = Object.keys(textCommands).find(
        name =>
          message.content.split(" ")[0].toLowerCase() ===
          prefix + name.toLowerCase()
      )

      if (name) textCommands[name].handle(this, this._prismaClient, message)
    })
  }

  public start(
    callback: (
      client: DjsClient<true>,
      configuration: IConfiguration,
      logger: ILogger
    ) => void
  ): void {
    this._djsClient.once(Events.ClientReady, (client: DjsClient<true>) =>
      callback(client, this._configuration, this._logger)
    )

    this._djsClient.login(this._configuration.get("DISCORD_BOT_TOKEN"))
  }
}
