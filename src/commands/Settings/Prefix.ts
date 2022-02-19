import { Command } from "../.."

export const COMMAND: Command = {
  name: "prefix",
  description: "設定指令前綴",
  usage: "prefix <前綴>",
  category: "Settings",
  run: async (client, message, args) => {
    try {
      const { guildId } = message;
      if(!args.length) return await message.reply({
        embeds: [{
          title: "指令: Prefix",
          description: `> ${client.config.get(`${guildId}_prefix`) || "+"}${COMMAND.usage}`,
          color: "RANDOM"
        }]
      });
      const prefix = args[0];
      client.config.set(`${guildId}_prefix`, prefix);
      await message.reply(`${client.emotes.v} **將指令前綴設為** \`${prefix}\` !`);
    } catch(err) {
      client.logger.error(err);
    }
  }
}