import { Command } from "../.."

export const COMMAND: Command = {
  name: "logchannel",
  description: "設定日誌頻道",
  usage: "logchannel <伺服器ID> <頻道ID>",
  category: "Owner",
  owner: true,
  run: async (client, message, args) => {
    try {
      const guildId = args[0];
      const guild = client.guilds.resolve(guildId);
      if(!guild) return await message.reply(`${client.emotes.x} **找不到此伺服器!**`);
      const channel = message.mentions.channels.first() || guild.channels.resolve(args[1]);
      if(!channel || channel.type !== "GUILD_TEXT" || channel.guildId !== guild.id) return await message.reply(`${client.emotes.x} **無效的頻道!**`);
      client.logger.config.set("guild", guild.id);
      client.logger.config.set("channel", channel.id);
      await message.reply(`${client.emotes.v} **已將** ${channel} **設為機器人日誌頻道!**`);
    } catch(err) {
      client.logger.error(err);
    }
  }
}