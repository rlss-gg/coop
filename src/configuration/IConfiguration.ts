export default interface IConfiguration {
  /**
   * Get a configuration value.
   * @param key The key of the value being requested
   * @returns The requested value
   */
  get: (key: string) => string
}
