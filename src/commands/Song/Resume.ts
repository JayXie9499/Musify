import { Command } from "../.."

export const COMMAND: Command = {
  name: "resume",
  description: "取消暫停音樂播放器",
  usage: "resume",
  category: "Song",
  aliases: ["continue", "res"],
  run: async (client, message) => {
    try {
      const { guildId, member } = message;
      const player = client.manager.get(guildId!);
      const mVoice = member!.voice.channel;
      if(!player) return await message.reply(`${client.emotes.x} **沒有運作中的音樂播放器!**`);
      if(!mVoice || mVoice.id !== player.voiceChannel) return await message.reply(`${client.emotes.x} **你不在我的語音頻道中!**`);
      switch(player.paused) {
        case true:
          player.pause(false);
          await message.reply(`${client.emotes.v} **取消暫停音樂播放器!**`);
          break;
        case false:
          await message.reply(`${client.emotes.x} **音樂播放器沒有被暫停!**`);
          break;
      }
    } catch(err) {
      client.logger.error(err);
    }
  }
}