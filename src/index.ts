import { Client as DjsClient, GatewayIntentBits } from "discord.js"
import Client from "./client/Client"
import ConsoleLogger from "./logger/ConsoleLogger"
import DotEnvConfigurationBuilder from "./configuration/DotEnvConfigurationBuilder"

// Setup dependencies
const configuration = new DotEnvConfigurationBuilder()
  .useDotEnv(() => ({
    DISCORD_BOT_TOKEN: process.env["DISCORD_BOT_TOKEN"]
  }))
  .build()

const logger = new ConsoleLogger()

const djsClient = new DjsClient({
  intents: [
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
})

// Create client and configure events
const client = new Client(configuration, logger, djsClient)

// Start client
client.start((client, logger) =>
  logger.log("INFO", `${client.user.username} is now online`)
)
