import { Command } from "../.."

export const COMMAND: Command = {
  name: "leave",
  description: "使機器人離開語音",
  usage: "leave",
  category: "Voice",
  aliases: ["disconnect", "dis"],
  run: async (client, message) => {
    try {
      const { guildId, member } = message;
      const mVoice = member!.voice.channel;
      const player = client.manager.get(guildId!);
      if(!player) return await message.reply(`${client.emotes.x} **沒有運作中的音樂播放器!**`);
      if(!mVoice || mVoice.id !== player.voiceChannel) return await message.reply(`${client.emotes.x} **你不在我的語音頻道中!**`);
      player.disconnect();
      player.destroy();
      await message.reply(`${client.emotes.v} **離開** ${mVoice} **!**`);
    } catch(err) {
      client.logger.error(err);
    }
  }
}