import DuplicateKeyError from "../../errors/DuplicateKeyError"
import Configuration from "../../models/configuration/Configuration"
import IConfiguration from "../../models/configuration/IConfiguration"
import IConfigurationBuilder from "./IConfigurationBuilder"
import { configDotenv } from "dotenv"
import InvalidKeyError from "../../errors/InvalidKeyError"
import fs from "fs"

export default class ConfigurationBuilder implements IConfigurationBuilder {
  protected readonly _store: Record<string, string> = {}

  public add(key: string, value: string): IConfigurationBuilder {
    if (this._store[key]) throw new DuplicateKeyError(key)
    this._store[key] = value
    return this
  }

  public loadDotEnv(...keys: string[]): IConfigurationBuilder {
    configDotenv()

    keys.forEach(key => {
      const value = process.env[key]
      if (!value) throw new InvalidKeyError(key)
      this.add(key, value)
    })

    return this
  }

  public loadJson(file: string): IConfigurationBuilder {
    const recursivelyAdd = (data: unknown, parents: string[] = []) => {
      switch (typeof data) {
        case "object":
          if (data && !Array.isArray(data))
            Object.entries(data).forEach(([key, value]) =>
              recursivelyAdd(value, [...parents, key])
            )
          break
        case "string":
        case "number":
        case "boolean":
          this.add(parents.join("."), String(data))
          break
      }
    }

    const json = JSON.parse(fs.readFileSync(file).toString())
    recursivelyAdd(json)

    return this
  }

  public build(): IConfiguration {
    return new Configuration(this._store)
  }
}
