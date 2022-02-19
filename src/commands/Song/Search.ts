import { MessageActionRow, MessageSelectOptionData } from "discord.js"
import { Command, get247, lengthFormmater } from "../.."

export const COMMAND: Command = {
  name: "search",
  description: "搜尋音樂",
  usage: "search <關鍵字>",
  category: "Song",
  aliases: ["find"],
  run: async (client, message, args) => {
    try {
      const { guildId, channel, channelId, member, author } = message;
      if(!args.length) return await message.reply({
        embeds: [{
          title: "指令: Search",
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
      if(!player.voiceChannel) {
        player.setVoiceChannel(mVoice.id);
        player.connect();
      } else if(mVoice.id !== player.voiceChannel) {
        return await message.reply(`${client.emotes.x} **你不在我的語音頻道中!**`);
      }
      const res = await client.manager.search(query, author);
      res.tracks.splice(10);
      let results = "";
      const indexes = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
      const options: Array<MessageSelectOptionData> = [];
      for(const track of res.tracks) {
        const index = res.tracks.indexOf(track);
        results = results.concat(`\n\`${res.tracks.indexOf(track) + 1}.\` [${track.title}](${track.uri})\n`);
        options.push({
          emoji: indexes[index],
          label: track.title,
          value: `${index}`,
          description: track.author
        });
      }
      const row = new MessageActionRow()
        .addComponents([{
          type: "SELECT_MENU",
          customId: "results",
          placeholder: "選擇音樂",
          maxValues: 1,
          options: options
        }]);
      const reply = await message.reply({
        embeds: [{
          author: {
            name: `${query} 的搜尋結果`,
            iconURL: author.displayAvatarURL({
              dynamic: true,
              size: 128
            })
          },
          description: results,
          color: "RANDOM"
        }],
        components: [row]
      });
      const sel = await reply.awaitMessageComponent({
        filter: (interaction) => interaction.user == author,
        componentType: "SELECT_MENU",
        time: 300000,
        dispose: true
      });
      if(!!sel.values[0]) {
        if(!player.get("leave_cd")) player.set("leave_cd", true);
        const track = res.tracks[Number(sel.values[0])];
        player.queue.add(track);
        await channel.send({
          embeds: [{
            author: {
              name: `將 ${track.title} 新增至播放清單`,
              iconURL: author.displayAvatarURL({
                dynamic: true,
                size: 128
              }),
              url: track.uri
            },
            fields: [{
              name: "__**長度**__",
              value: `\`${track.isStream ? "🔴直播中" : lengthFormmater(track.duration)}\``,
              inline: true
            }, {
              name: "__**作者**__",
              value: `\`${track.author}\``,
              inline: true
            }],
            color: "RANDOM"
          }]
        });
        if(!player.playing && !player.paused && !player.queue.size) player.play();
        if(!player.playing && !player.paused && player.queue.totalSize == res.tracks.length) player.play();
      }
      await reply.delete();
    } catch(err) {
      client.logger.error(err);
    }
  }
}