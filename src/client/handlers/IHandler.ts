import Client from "../Client"

export default interface IHandler {
  name: string

  handle(client: Client, ...args: any[]): Promise<void>
}
