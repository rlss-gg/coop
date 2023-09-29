import { Client as DjsClient, Events } from "discord.js"
import IConfiguration from "../configuration/IConfiguration"
import ILogger from "../logger/ILogger"
import { EventTypes } from "../types/EventTypes"

export default class Client {
  private readonly _configuration: IConfiguration
  private readonly _logger: ILogger
  private readonly _djsClient: DjsClient<true>

  public constructor(
    configuration: IConfiguration,
    logger: ILogger,
    djsClient: DjsClient,
    events: EventTypes.Collection
  ) {
    this._configuration = configuration
    this._logger = logger
    this._djsClient = djsClient

    Object.entries(events).forEach(([name, events]) => {
      const list = ["", ...events.map(event => `- ${event.name}`)].join("\r\n")
      this._logger.log("INFO", `Configuring ${name} events: ${list}`)

      events.forEach(event =>
        this._djsClient[event.type](name, (...args: any[]) =>
          event.handle(this, ...args)
        )
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
    this._djsClient.once(Events.ClientReady, (client: DjsClient<true>) =>
      callback(client, this._configuration, this._logger)
    )

    this._djsClient.login(this._configuration.get("DISCORD_BOT_TOKEN"))
  }
}
