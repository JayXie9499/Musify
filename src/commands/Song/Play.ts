import { Command, enqueueSong, get247, getEnqueueType } from "../.."

export const COMMAND: Command = {
  name: "play",
  description: "播放音樂",
  usage: "play <關鍵字 | 網址>",
  category: "Song",
  aliases: ["p", "playtop", "ptop", "pt", "playnow", "pnow", "pn", "playskip", "pskip", "ps"],
  run: async (client, message, args, commandName) => {
    try {
      const { guildId, channelId, member, author } = message;
      if(!args.length) return await message.reply({
        embeds: [{
          title: "指令: Play",
          description: `> ${client.config.get(`${guildId}_prefix`) || "+"}${COMMAND.usage}`,
          color: "RANDOM"
        }]
      });
      const query = args.join(" ");
      const mVoice = member!.voice.channel;
      if(!mVoice) return await message.reply(`${client.emotes.x} **你不在語音頻道裡!**`);
      const player = client.manager.create({
        guild: guildId!,
        textChannel: channelId
      });
      if(!player.get("leave_cd")) player.set("leave_cd", true);
      if(!player.voiceChannel) {
        player.setVoiceChannel(mVoice.id);
        player.connect();
      } else if(mVoice.id !== player.voiceChannel) {
        return await message.reply(`${client.emotes.x} **你不在我的語音頻道中!**`);
      }
      await enqueueSong(client, message, player, query, author, getEnqueueType(commandName));
    } catch(err) {
      client.logger.error(err);
    }
  }
}