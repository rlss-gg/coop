import DuplicateKeyError from "../errors/DuplicateKeyError"
import Configuration from "./Configuration"
import IConfiguration from "./IConfiguration"
import IConfigurationBuilder from "./IConfigurationBuilder"

export default abstract class ConfigurationBuilder
  implements IConfigurationBuilder
{
  protected readonly _store: Record<string, string> = {}

  public add(key: string, value: string): IConfigurationBuilder {
    if (this._store[key]) throw new DuplicateKeyError(key)
    this._store[key] = value
    return this
  }

  public build(): IConfiguration {
    return new Configuration(this._store)
  }
}
