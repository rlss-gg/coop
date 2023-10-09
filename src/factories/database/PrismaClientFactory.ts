import { PrismaClient } from "@prisma/client"

export default class PrismaClientFactory {
  private readonly client: PrismaClient

  public constructor() {
    this.client = new PrismaClient()
    this.client.$connect()
  }

  public createClient(): PrismaClient {
    return this.client
  }
}
