export default abstract class BaseError extends Error {
  public readonly type: string

  public constructor(type: string, message: string) {
    super(message)
    this.type = type
  }
}
