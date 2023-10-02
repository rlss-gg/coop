import { GatewayIntentBits } from "discord.js"
import ConsoleLogger from "./logger/ConsoleLogger"
import ConfigurationBuilder from "./configuration/ConfigurationBuilder"
import ClientBuilder from "./client/ClientBuilder"
import MessageDeleteLogger from "./events/MessageDeleteLogger"
import MessageUpdateLogger from "./events/MessageUpdateLogger"
import Ping from "./textCommands/Ping"

// Setup dependencies
const configuration = new ConfigurationBuilder()
  .loadDotEnv("DISCORD_BOT_TOKEN")
  .loadJson("config.json")
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
