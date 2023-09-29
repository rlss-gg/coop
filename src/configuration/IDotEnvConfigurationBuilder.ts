import { DotEnvTypes } from "../types/DotEnvTypes"
import IConfigurationBuilder from "./IConfigurationBuilder"

export default interface IDotEnvConfigurationBuilder {
  /**
   * Add keys to the configuration from dotenv.
   * @param keyCaller A callback to selectively add keys from dotenv
   * @returns The configuration builder
   */
  useDotEnv: (
    keyCaller: () => Record<DotEnvTypes.Key, string | undefined>
  ) => IDotEnvConfigurationBuilder
}
