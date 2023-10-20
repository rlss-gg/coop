import BaseError from "./BaseError"

export default class GuildNotFoundError extends BaseError {
  public constructor(guildId: string) {
    super(`The guild '${guildId}' could not be found`)
  }
}
