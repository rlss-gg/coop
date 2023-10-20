import BaseError from "./BaseError"

export default class DuplicateKeyError extends BaseError {
  public constructor(key: string) {
    super(`The key '${key}' is already configured`)
  }
}
