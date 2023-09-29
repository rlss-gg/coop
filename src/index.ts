import { GatewayIntentBits } from "discord.js"
import ConsoleLogger from "./logger/ConsoleLogger"
import DotEnvConfigurationBuilder from "./configuration/DotEnvConfigurationBuilder"
import ClientBuilder from "./client/ClientBuilder"
import MessageDeleteLogger from "./events/MessageDeleteLogger"
import MessageUpdateLogger from "./events/MessageUpdateLogger"
import Ping from "./textCommands/ping"

// Setup dependencies
const configuration = new DotEnvConfigurationBuilder()
  .useDotEnv(() => ({
    DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN,
    LOG_CHANNEL_ID: process.env.LOG_CHANNEL_ID,
    LOG_GUILD_ID: process.env.LOG_GUILD_ID,
    TEXT_COMMAND_PREFIX: process.env.TEXT_COMMAND_PREFIX
  }))
  .build()

const logger = new ConsoleLogger()

// Create client and configure events
const client = new ClientBuilder(configuration, logger)
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
