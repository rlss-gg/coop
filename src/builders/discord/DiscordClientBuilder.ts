import DiscordClient from "../../clients/discord/DiscordClient"
import { Client as DjsClient, GatewayIntentBits } from "discord.js"
import DuplicateKeyError from "../../errors/DuplicateKeyError"
import { HandlerTypes } from "../../types/HandlerTypes"

export default class DiscordClientBuilder {
  public readonly gatewayIntentBits: GatewayIntentBits[] = []
  public readonly handlers: HandlerTypes.Collection = {}

  public useGatewayIntentBit(bit: GatewayIntentBits): DiscordClientBuilder {
    if (this.gatewayIntentBits.includes(bit))
      throw new DuplicateKeyError(GatewayIntentBits[bit])
    this.gatewayIntentBits.push(bit)

    return this
  }

  public useGatewayIntentBits(
    ...bits: GatewayIntentBits[]
  ): DiscordClientBuilder {
    bits.forEach(bit => this.useGatewayIntentBit(bit))

    return this
  }

  public addHandler(ctor: HandlerTypes.Constructor): DiscordClientBuilder {
    var handler = new ctor()
    if (this.handlers[handler.name]) throw new DuplicateKeyError(handler.name)
    this.handlers[handler.name] = handler

    return this
  }

  public build(): DiscordClient {
    const djsClient = new DjsClient({ intents: this.gatewayIntentBits })

    return new DiscordClient(djsClient, this.handlers)
  }
}
