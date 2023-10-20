import InvalidKeyError from "../../errors/InvalidKeyError"

export default class Container {
  private static _instance: Container

  private readonly _providers: Record<string, any> = {}

  public resolve(token: string) {
    if (!this._providers[token]) throw new InvalidKeyError(token)
    return this._providers[token]
  }

  public provide(token: string, provider: any) {
    this._providers[token] = provider
  }

  public register(token: string, provider: () => any) {
    this._providers[token] = provider()
  }

  public static getInstance(): Container {
    if (!Container._instance) Container._instance = new Container()
    return Container._instance
  }
}
