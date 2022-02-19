import { Command } from "../.."

export const COMMAND: Command = {
  name: "247",
  description: "開啟/關閉24H模式",
  usage: "247",
  category: "Settings",
  run: async (client, message) => {
    try {
      const { guildId } = message;
      const twentyFourSeven = !!Number(client.config.get(`${guildId}_247`));
      switch(twentyFourSeven) {
        case true:
          client.config.set(`${guildId}_247`, "0");
          await message.reply(`${client.emotes.v} **關閉24H模式!**`);
          break;
        case false:
          client.config.set(`${guildId}_247`, "1");
          await message.reply(`${client.emotes.v} **開啟24H模式!**`);
          break;
      }
    } catch(err) {
      client.logger.error(err);
    }
  }
}