import BaseError from "./BaseError"

export default class GuildNotFoundError extends BaseError {
  public constructor(guildId: string) {
    super("GuildNotFoundError", `The guild '${guildId}' could not be found`)
  }
}
