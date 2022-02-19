import { Command } from "../.."

export const COMMAND: Command = {
  name: "loop",
  description: "開啟/關閉歌曲循環",
  usage: "loop",
  category: "Song",
  aliases: ["repeat"],
  run: async (client, message) => {
    try {
      const { guildId, member } = message;
      const player = client.manager.get(guildId!);
      const mVoice = member!.voice.channel;
      if(!player) return await message.reply(`${client.emotes.x} **沒有運作中的音樂播放器!**`);
      if(!mVoice || mVoice.id !== player.voiceChannel) return await message.reply(`${client.emotes.x} **你不在我的語音頻道中!**`);
      if(player.queueRepeat) player.setQueueRepeat(false);
      switch(player.trackRepeat) {
        case true:
          player.setTrackRepeat(false);
          await message.reply(`${client.emotes.v} **關閉歌曲循環!**`);
          break;
        case false:
          player.setTrackRepeat(true);
          await message.reply(`${client.emotes.v} **開啟歌曲循環!**`);
          break;
      }
    } catch(err) {
      client.logger.error(err);
    }
  }
}