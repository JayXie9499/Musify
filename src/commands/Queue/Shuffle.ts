import { Command } from "../.."

export const COMMAND: Command = {
  name: "shuffle",
  description: "打亂播放清單中的音樂序位",
  usage: "shuffle",
  category: "Queue",
  run: async (client, message) => {
    try {
      const { guildId, member } = message;
      const player = client.manager.get(guildId!);
      const mVoice = member!.voice.channel;
      if(!player) return await message.reply(`${client.emotes.x} **沒有運作中的音樂播放器!**`);
      if(!mVoice || mVoice.id !== player.voiceChannel) return await message.reply(`${client.emotes.x} **你不在我的語音頻道中!**`);
      if(!player.queue.size) return await message.reply(`${client.emotes.x} **沒有音樂在播放清單中!**`);
      player.queue.shuffle();
      await message.reply(`${client.emotes.v} **打亂播放清單!**`);
    } catch(err) {
      client.logger.error(err);
    }
  }
}