import { Client as DjsClient, Events } from "discord.js"
import IConfiguration from "../configuration/IConfiguration"
import ILogger from "../logger/ILogger"

export default class Client {
  private readonly _configuration: IConfiguration
  private readonly _logger: ILogger
  private readonly _client: DjsClient<true>

  public constructor(
    configuration: IConfiguration,
    logger: ILogger,
    client: DjsClient
  ) {
    this._configuration = configuration
    this._logger = logger
    this._client = client
  }

  public start(
    callback: (client: DjsClient<true>, logger: ILogger) => void
  ): void {
    this._client.once(Events.ClientReady, (client: DjsClient<true>) =>
      callback(client, this._logger)
    )

    this._client.login(this._configuration.get("DISCORD_BOT_TOKEN"))
  }
}
