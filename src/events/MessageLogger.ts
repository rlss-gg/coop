import Client from "../client/Client"
import Event from "../client/models/Event"
import IConfiguration from "../configuration/IConfiguration"
import ILogger from "../logger/ILogger"
import { Events, Message } from "discord.js"
import { EventTypes } from "../types/EventTypes"

export default class MessageLogger extends Event {
  public override readonly name: string = "MessageLogger"
  public override readonly type: EventTypes.Type = "on"
  public override readonly event: Events = Events.MessageCreate

  public constructor(configuration: IConfiguration, logger: ILogger) {
    super(configuration, logger)
  }

  public override async handle(
    client: Client,
    message: Message
  ): Promise<void> {
    this._logger.log("INFO", message.content)
  }
}
