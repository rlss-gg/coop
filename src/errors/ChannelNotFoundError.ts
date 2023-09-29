import BaseError from "./BaseError"

export default class ChannelNotFoundError extends BaseError {
  public constructor(channelId: string) {
    super(
      "ChannelNotFoundError",
      `The channel '${channelId}' could not be found`
    )
  }
}
