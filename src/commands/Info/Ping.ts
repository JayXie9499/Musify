import { Command } from "../.."

export const COMMAND: Command = {
  name: "ping",
  description: "顯示機器人延遲",
  usage: "ping",
  category: "Info",
  run: async (client, message) => {
    try {
      const pinging = await message.reply("檢測延遲中...");
      await pinging.edit({
        content: null,
        embeds: [{
          description: `⌛ ${pinging.createdTimestamp - message.createdTimestamp}ms\n💓 ${client.ws.ping}ms`,
          color: "RANDOM"
        }]
      });
    } catch(err) {
      client.logger.error(err);
    }
  }
}