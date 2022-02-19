import { MessageEmbedOptions } from "discord.js"
import { Command, lengthFormmater, pagination } from "../.."

export const COMMAND: Command = {
  name: "queue",
  description: "顯示播放清單中的所有音樂",
  usage: "queue",
  category: "Queue",
  aliases: ["q"],
  run: async (client, message) => {
    try {
      const { guild, guildId } = message;
      const player = client.manager.get(guildId!);
      if(!player) return await message.reply(`${client.emotes.x} **沒有運作中的音樂播放器!**`);
      if(!player.queue.size) return await message.reply(`${client.emotes.x} **沒有音樂在播放清單中!**`);
      const embeds: Array<MessageEmbedOptions> = [];
      let songs = "";
      for(let i = 0; i < player.queue.size; i++) {
        songs = songs.concat(`\n\`${i + 1}.\` [${player.queue[i].title}](${player.queue[i].uri})\n> ${player.queue[i].requester} | ${(player.queue[i].isStream ? "🔴直播中" : lengthFormmater(player.queue[i].duration!))}\n`);
        if(((i + 1) % 10) == 0 || (i + 1) == player.queue.size) {
          embeds.push({
            author: {
              name: "播放清單",
              iconURL: guild!.iconURL({
                dynamic: true,
                size: 64
              }) || undefined
            },
            description: songs,
            color: "RANDOM"
          });
          songs = "";
        }
      }
      if(embeds.length > 1)
        await pagination(client, message, embeds);
      else
        await message.reply({
          embeds: [embeds[0]]
        });
    } catch(err) {
      client.logger.error(err);
    }
  }
}