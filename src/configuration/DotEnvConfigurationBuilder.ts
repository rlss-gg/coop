import InvalidKeyError from "../errors/InvalidKeyError"
import { DotEnvTypes } from "../types/DotEnvTypes"
import ConfigurationBuilder from "./ConfigurationBuilder"
import IConfigurationBuilder from "./IConfigurationBuilder"
import { configDotenv } from "dotenv"
import IDotEnvConfigurationBuilder from "./IDotEnvConfigurationBuilder"
import DuplicateKeyError from "../errors/DuplicateKeyError"

export default class DotEnvConfigurationBuilder
  extends ConfigurationBuilder
  implements IDotEnvConfigurationBuilder, IConfigurationBuilder
{
  public useDotEnv(
    keyCaller: () => Record<DotEnvTypes.Key, string | undefined>
  ): DotEnvConfigurationBuilder {
    configDotenv()
    const keys = keyCaller()

    Object.entries(keys).forEach(([key, value]) => {
      if (!value) throw new InvalidKeyError(key)
      if (this._store[key]) throw new DuplicateKeyError(key)
      this.add(key, value)
    })

    return this
  }
}
