import { MessageEmbedOptions } from "discord.js"
import { aliasesString, capFirstLetter, Command, pagination } from "../.."

export const COMMAND: Command = {
  name: "help",
  description: "顯示所有指令",
  usage: "help",
  category: "Info",
  run: async (client, message) => {
    try {
      const { guildId } = message;
      const prefix = client.config.get(`${guildId}_prefix`) || "+";
      const commands = client.commands
        .filter((command) => !command.owner)
        .map((command) => command);
      const info_cmd = commands.filter((command) => command.category == "Info");
      const voice_cmd = commands.filter((command) => command.category == "Voice");
      const song_cmd = commands.filter((command) => command.category == "Song");
      const queue_cmd = commands.filter((command) => command.category == "Queue");
      const settings_cmd = commands.filter((command) => command.category == "Settings");
      const embeds: Array<MessageEmbedOptions> = [{
        title: "資訊指令"
      }, {
        title: "語音指令"
      }, {
        title: "歌曲指令"
      }, {
        title: "播放清單指令"
      }, {
        title: "設置指令"
      }];
      for(const embed of embeds) {
        embed.fields = [];
        embed.color = "RANDOM";
      }
      for(const command of info_cmd) embeds[0].fields!.push({
        name: `${client.emotes.diamond} ${capFirstLetter(command.name)}`,
        value: `> ${command.description}\n用法: ${prefix}${command.usage}${(!!command.aliases ? `\n別名: ${aliasesString(command.aliases)}` : "")}`
      });
      for(const command of voice_cmd) embeds[1].fields!.push({
        name: `${client.emotes.diamond} ${capFirstLetter(command.name)}`,
        value: `> ${command.description}\n用法: ${prefix}${command.usage}${(!!command.aliases ? `\n別名: ${aliasesString(command.aliases)}` : "")}`
      });
      for(const command of song_cmd) embeds[2].fields!.push({
        name: `${client.emotes.diamond} ${capFirstLetter(command.name)}`,
        value: `> ${command.description}\n用法: ${prefix}${command.usage}${(!!command.aliases ? `\n別名: ${aliasesString(command.aliases)}` : "")}`
      });
      for(const command of queue_cmd) embeds[3].fields!.push({
        name: `${client.emotes.diamond} ${capFirstLetter(command.name)}`,
        value: `> ${command.description}\n用法: ${prefix}${command.usage}${(!!command.aliases ? `\n別名: ${aliasesString(command.aliases)}` : "")}`
      });
      for(const command of settings_cmd) embeds[4].fields!.push({
        name: `${client.emotes.diamond} ${capFirstLetter(command.name)}`,
        value: `> ${command.description}\n用法: ${prefix}${command.usage}${(!!command.aliases ? `\n別名: ${aliasesString(command.aliases)}` : "")}`
      });
      await pagination(client, message, embeds);
    } catch(err) {
      client.logger.error(err);
    }
  }
}