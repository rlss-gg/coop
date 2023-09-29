import { GatewayIntentBits } from "discord.js"
import ConsoleLogger from "./logger/ConsoleLogger"
import DotEnvConfigurationBuilder from "./configuration/DotEnvConfigurationBuilder"
import ClientBuilder from "./client/ClientBuilder"
import MessageLogger from "./events/MessageLogger"

// Setup dependencies
const configuration = new DotEnvConfigurationBuilder()
  .useDotEnv(() => ({
    DISCORD_BOT_TOKEN: process.env["DISCORD_BOT_TOKEN"]
  }))
  .build()

const logger = new ConsoleLogger()

// Create client and configure events
const client = new ClientBuilder(configuration, logger)
  .useGatewayIntentBits(
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  )
  .addEvent(MessageLogger)
  .build()

// Start client
client.start((client, configuration, logger) =>
  logger.log("INFO", `${client.user.username} is now online`)
)
