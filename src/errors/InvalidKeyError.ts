import BaseError from "./BaseError"

export default class InvalidKeyError extends BaseError {
  public constructor(key: string) {
    super("InvalidKeyError", `The key '${key}' is not present in the object`)
  }
}
