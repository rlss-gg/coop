import { GatewayIntentBits } from "discord.js"
import ConfigurationBuilder from "./builders/configuration/ConfigurationBuilder"
import ClientBuilder from "./builders/discord/DiscordClientBuilder"
import MessageDeleteLogger from "./handlers/events/MessageDeleteLogger"
import MessageUpdateLogger from "./handlers/events/MessageUpdateLogger"
import Ping from "./handlers/textCommands/Ping"
import PrismaClientFactory from "./factories/database/PrismaClientFactory"
import ConsoleLoggerFactory from "./factories/logger/ConsoleLoggerFactory"

// Setup dependencies
const configuration = new ConfigurationBuilder()
  .loadDotEnv("DISCORD_BOT_TOKEN")
  .loadJson("config.json")
  .build()

const loggerFactory = new ConsoleLoggerFactory()

const prismaClientFactory = new PrismaClientFactory()

// Create client and configure events
const client = new ClientBuilder(
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
  .addEvent(MessageDeleteLogger)
  .addEvent(MessageUpdateLogger)
  .addTextCommand(Ping)
  .build()

// Start client
client.start((client, configuration, logger) =>
  logger.log("DEBUG", `${client.user.username} is now online`)
)
