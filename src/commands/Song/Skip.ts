import { Command } from "../.."

export const COMMAND: Command = {
  name: "skip",
  description: "跳過播放中的音樂",
  usage: "skip",
  category: "Song",
  aliases: ["s", "next"],
  run: async (client, message) => {
    try {
      const { guildId, member } = message;
      const player = client.manager.get(guildId!);
      const mVoice = member!.voice.channel;
      if(!player) return await message.reply(`${client.emotes.x} **沒有運作中的音樂播放器!**`);
      if(!mVoice || mVoice.id !== player.voiceChannel) return await message.reply(`${client.emotes.x} **你不在我的語音頻道中!**`);
      if(!player.queue.current) return await message.reply(`${client.emotes.x} **沒有音樂在播放!**`);
      player.stop();
      await message.reply(`${client.emotes.v} **跳過歌曲!**`);
    } catch(err) {
      client.logger.error(err);
    }
  }
}