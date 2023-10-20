import BaseError from "./BaseError"

export default class InteractionNotHandledError extends BaseError {
  public constructor(interactionId: string) {
    super(`The interaction '${interactionId}' was not handled`)
  }
}
