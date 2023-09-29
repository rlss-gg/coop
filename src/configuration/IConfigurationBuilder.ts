import IConfiguration from "./IConfiguration"

export default interface IConfigurationBuilder {
  /**
   * Add a value to the configuration.
   * @param key The key of the value
   * @param value The value to store
   */
  add: (key: string, value: string) => IConfigurationBuilder

  /**
   * Build the configuration.
   * @returns The built configuration
   */
  build: () => IConfiguration
}
