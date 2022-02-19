import { Command } from "../.."

export const COMMAND: Command = {
  name: "skipto",
  description: "跳至播放清單中的一首歌",
  usage: "skipto <序位>",
  category: "Queue",
  aliases: ["st"],
  run: async (client, message, args) => {
    try {
      const { guildId, member } = message;
      const player = client.manager.get(guildId!);
      const mVoice = member!.voice.channel;
      const index = Number(args[0]);
      if(!args.length) return await message.reply({
        embeds: [{
          title: "指令: SkipTo",
          description: `> ${client.config.get(`${guildId}_prefix`) || "+"}${COMMAND.usage}`,
          color: "RANDOM"
        }]
      });
      if(!player) return await message.reply(`${client.emotes.x} **沒有運作中的音樂播放器!**`);
      if(!mVoice || mVoice.id !== player.voiceChannel) return await message.reply(`${client.emotes.x} **你不在我的語音頻道中!**`);
      if(!player.queue.size) return await message.reply(`${client.emotes.x} **沒有音樂在播放清單中!**`);
      if(!index || index < 0 || index > player.queue.size) return await message.reply(`${client.emotes.x} **請輸入有效的數字序位!**`);
      player.stop(index - 1);
      await message.reply(`${client.emotes.v} **跳至第** \`${index}\` **首音樂!**`);
    } catch(err) {
      client.logger.error(err);
    }
  }
}