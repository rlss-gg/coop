import { GatewayIntentBits } from "discord.js"
import ConfigurationBuilder from "./builders/configuration/ConfigurationBuilder"
import DiscordClientBuilder from "./builders/discord/DiscordClientBuilder"
import PrismaClientFactory from "./factories/database/PrismaClientFactory"
import ConsoleLoggerFactory from "./factories/logger/ConsoleLoggerFactory"
import MessageDeleteLogger from "./handlers/MessageDeleteLogger"
import MessageUpdateLogger from "./handlers/MessageUpdateLogger"
import PingCommand from "./handlers/PingCommand"

// Setup dependencies
const configuration = new ConfigurationBuilder()
  .loadDotEnv("DISCORD_BOT_TOKEN")
  .loadJson("config.json")
  .build()

const loggerFactory = new ConsoleLoggerFactory()

const prismaClientFactory = new PrismaClientFactory()

// Create client and configure events
const client = new DiscordClientBuilder(
  configuration,
  loggerFactory,
  prismaClientFactory
)
  .useGatewayIntentBits(
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.Guilds
  )
  .addHandler(MessageDeleteLogger)
  .addHandler(MessageUpdateLogger)
  .addHandler(PingCommand)
  .build()

// Start client
client.start((client, configuration, logger) =>
  logger.log("DEBUG", `${client.user.username} is now online`)
)
