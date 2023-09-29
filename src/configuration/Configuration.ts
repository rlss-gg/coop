import InvalidKeyError from "../errors/InvalidKeyError"
import IConfiguration from "./IConfiguration"

export default class Configuration implements IConfiguration {
  private readonly _store: Record<string, string>

  public constructor(store: Record<string, string>) {
    this._store = store
  }

  public get(key: string): string {
    if (!this._store[key]) throw new InvalidKeyError(key)
    return this._store[key]
  }
}
