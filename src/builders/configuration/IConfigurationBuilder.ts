import IConfiguration from "../../models/configuration/IConfiguration"

export default interface IConfigurationBuilder {
  /**
   * Add a value to the configuration.
   * @param key The key of the value
   * @param value The value to store
   * @returns The configuration builder
   */
  add: (key: string, value: string) => IConfigurationBuilder

  /**
   * Load the specified keys from a `.env` file.
   * @param keys The keys to load
   * @returns The configuration builder
   */
  loadDotEnv: (...keys: string[]) => IConfigurationBuilder

  /**
   * Load configuration values from a JSON file.
   * @param file The JSON file to load
   * @returns The configuration builder
   */
  loadJson: (file: string) => IConfigurationBuilder

  /**
   * Build the configuration.
   * @returns The built configuration
   */
  build: () => IConfiguration
}
