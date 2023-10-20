export default abstract class BaseError extends Error {
  public readonly type: string

  public constructor(message: string) {
    super(message)
    this.type = this.constructor.name
  }
}
