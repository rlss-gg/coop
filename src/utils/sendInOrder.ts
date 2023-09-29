import { TextBasedChannel } from "discord.js"

/**
 * Send multiple messages in order.
 * @param channel The channel to send the messages in
 * @param content The content of the messages to be sent
 */
export default async function sendInOrder(
  channel: TextBasedChannel,
  ...content: string[]
): Promise<void> {
  await channel.send(content[0])
  if (content.length > 1) sendInOrder(channel, ...content.slice(1))
}
