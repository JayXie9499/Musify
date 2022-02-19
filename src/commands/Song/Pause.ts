import { Command } from "../.."

export const COMMAND: Command = {
  name: "pause",
  description: "暫停音樂播放器",
  usage: "pause",
  category: "Song",
  aliases: ["stop"],
  run: async (client, message) => {
    try {
      const { guildId, member } = message;
      const player = client.manager.get(guildId!);
      const mVoice = member!.voice.channel;
      if(!player) return await message.reply(`${client.emotes.x} **沒有運作中的音樂播放器!**`);
      if(!mVoice || mVoice.id !== player.voiceChannel) return await message.reply(`${client.emotes.x} **你不在我的語音頻道中!**`);
      switch(player.paused) {
        case true:
          await message.reply(`${client.emotes.x} **音樂播放器已經被暫停了!**`);
          break;
        case false:
          player.pause(true);
          await message.reply(`${client.emotes.v} **暫停音樂播放器!**`);
          break;
      }
    } catch(err) {
      client.logger.error(err);
    }
  }
}