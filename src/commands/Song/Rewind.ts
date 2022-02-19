import { Command, lengthFormmater } from "../.."

export const COMMAND: Command = {
  name: "rewind",
  description: "倒轉播放中的音樂",
  usage: "rewind <秒數>",
  category: "Song",
  aliases: ["rwd"],
  run: async (client, message, args) => {
    try {
      const { guildId, member } = message;
      if(!args.length) return await message.reply({
        embeds: [{
          title: "指令: Rewind",
          description: `> ${client.config.get(`${guildId}_prefix`) || "+"}${COMMAND.usage}`,
          color: "RANDOM"
        }]
      });
      const seconds = Number(args[0]);
      const player = client.manager.get(guildId!);
      const mVoice = member!.voice.channel;
      if(!player) return await message.reply(`${client.emotes.x} **沒有運作中的音樂播放器!**`);
      if(!mVoice || mVoice.id !== player.voiceChannel) return await message.reply(`${client.emotes.x} **你不在我的語音頻道中!**`);
      if(!player.queue.current) return await message.reply(`${client.emotes.x} **沒有音樂在播放!**`);
      if(player.queue.current.isStream) return await message.reply(`${client.emotes.x} **你不能倒轉直播!**`);
      if(!seconds || !Number.isInteger(seconds)) return await message.reply(`${client.emotes.x} **無效的秒數!**`);
      const current = player.position;
      const target = ((current - (seconds * 1000)) <= 0 ? 0 : current - (seconds * 1000));
      player.seek(target);
      await message.reply(`${client.emotes.v} **將音樂倒轉到** \`${lengthFormmater(target)}\``);
    } catch(err) {
      client.logger.error(err);
    }
  }
}