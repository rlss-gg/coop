import BaseError from "./BaseError"

export default class InvalidKeyError extends BaseError {
  public constructor(key: string) {
    super(`The key '${key}' is not present in the object`)
  }
}
