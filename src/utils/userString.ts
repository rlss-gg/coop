import { User } from "discord.js"

export default function userString(user: User): string {
  return `**${user.username}** \`${user.id}\``
}
