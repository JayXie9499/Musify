import { splitBar } from "string-progressbar";
import { Command, lengthFormmater } from "../.."

export const COMMAND: Command = {
  name: "nowplaying",
  description: "顯示播放中的音樂資訊",
  usage: "nowplaying",
  category: "Song",
  aliases: ["np"],
  run: async (client, message) => {
    try {
      const { guildId, member, author } = message;
      const player = client.manager.get(guildId!);
      const mVoice = member!.voice.channel;
      if(!player) return await message.reply(`${client.emotes.x} **沒有運作中的音樂播放器!**`);
      if(!mVoice || mVoice.id !== player.voiceChannel) return await message.reply(`${client.emotes.x} **你不在我的語音頻道中!**`);
      if(!player.queue.current) return await message.reply(`${client.emotes.x} **沒有音樂在播放!**`);
      await message.reply({
        embeds: [{
          author: {
            name: player.queue.current.title,
            iconURL: author.displayAvatarURL({
              dynamic: true,
              size: 128
            }),
            url: player.queue.current.uri
          },
          description: (player.queue.current.isStream ? "\`🔴直播中\`" : `\`${splitBar(player.queue.current.duration!, player.position, 30)[0]}\` | \`${lengthFormmater(player.position)}/${lengthFormmater(player.queue.current.duration!)}\``),
          fields: [{
            name: "__**作者**__",
            value: `\`${player.queue.current.author}\``,
            inline: true
          },{
            name: "__**點播者**__",
            value: `${player.queue.current.requester}`,
            inline: true
          }],
          color: "RANDOM"
        }]
      });
    } catch(err) {
      client.logger.error(err);
    }
  }
}