import { Command } from "../.."

export const COMMAND: Command = {
  name: "loopqueue",
  description: "開啟/關閉播放清單循環",
  usage: "loopqueue",
  category: "Queue",
  aliases: ["lq"],
  run: async (client, message) => {
    try {
      const { guildId, member } = message;
      const player = client.manager.get(guildId!);
      const mVoice = member!.voice.channel;
      if(!player) return await message.reply(`${client.emotes.x} **沒有運作中的音樂播放器!**`);
      if(!mVoice || mVoice.id !== player.voiceChannel) return await message.reply(`${client.emotes.x} **你不在我的語音頻道中!**`);
      if(player.trackRepeat) player.setTrackRepeat(false);
      switch(player.queueRepeat) {
        case true:
          player.setQueueRepeat(false);
          await message.reply(`${client.emotes.v} **關閉播放清單循環!**`);
          break;
        case false:
          player.setQueueRepeat(true);
          await message.reply(`${client.emotes.v} **開啟播放清單循環!**`);
          break;
      }
    } catch(err) {
      client.logger.error(err);
    }
  }
}