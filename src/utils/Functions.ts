import { Message, MessageActionRow, MessageEmbed, MessageEmbedOptions, User } from "discord.js"
import { Player } from "erela.js"
import { Client } from ".."

export function getEnqueueType(cmd: string) {
  if(cmd == "playtop" || cmd == "ptop" || cmd == "pt") return "top";
  if(cmd == "playnow" || cmd == "pnow" || cmd == "pn" || cmd == "playskip" || cmd == "pskip" || cmd == "ps") return "now";
  return undefined;
}

export async function enqueueSong(client: Client, message: Message, player: Player, query: string, requester: User, type?: "top" | "now") {
  try {
    const res = await client.manager.search(query, requester);
    if(res.loadType == "LOAD_FAILED") return await message.reply(`${client.emotes.x} **音樂載入失敗!**`);
    if(res.loadType == "NO_MATCHES") return await message.reply(`${client.emotes.x} **找不到音樂!**`);
    if(res.loadType == "PLAYLIST_LOADED") {
      switch(type) {
        case "top":
          res.tracks.reverse();
          for(const track of res.tracks) player.queue.unshift(track);
          break;
        case "now":
          res.tracks.reverse();
          for(const track of res.tracks) player.queue.unshift(track);
          player.stop();
          break;
        default:
          player.queue.add(res.tracks);
          break;
      }
      await message.reply({
        embeds: [{
          author: {
            name: `將 ${res.playlist!.name} 新增至播放清單`,
            iconURL: requester.displayAvatarURL({
              dynamic: true,
              size: 128
            }),
            url: query
          },
          fields: [{
            name: "__**長度**__",
            value: `\`${lengthFormmater(res.playlist!.duration)}\``,
            inline: true
          }, {
            name: "__**曲數**__",
            value: `\`${res.tracks.length}\``,
            inline: true
          }],
          color: "RANDOM"
        }]
      });
    } else {
      switch(type) {
        case "top":
          player.queue.unshift(res.tracks[0]);
          break;
        case "now":
          player.queue.unshift(res.tracks[0]);
          player.stop();
          break;
        default:
          player.queue.add(res.tracks[0]);
          break;
      }
      await message.reply({
        embeds: [{
          author: {
            name: `將 ${res.tracks[0].title} 新增至播放清單`,
            iconURL: requester.displayAvatarURL({
              dynamic: true,
              size: 128
            }),
            url: res.tracks[0].uri
          },
          fields: [{
            name: "__**長度**__",
            value: `\`${res.tracks[0].isStream ? "🔴直播中" : lengthFormmater(res.tracks[0].duration)}\``,
            inline: true
          }, {
            name: "__**作者**__",
            value: `\`${res.tracks[0].author}\``,
            inline: true
          }],
          color: "RANDOM"
        }]
      });
    }
    if(!player.playing && !player.paused && !player.queue.size) player.play();
    if(!player.playing && !player.paused && player.queue.totalSize == res.tracks.length) player.play();
    if(!player.playing && !player.paused && (!player.queue.size || player.queue.totalSize == res.tracks.length) && !get247(client, message.guildId!)) {
      const destroyPlayer = setTimeout(() => {
        if(!player.get("leave_cd")) player.destroy();
        clearTimeout(destroyPlayer);
      }, 300000);
    }
  } catch(err) {
    client.logger.error(err);
  }
}

const formatInt = (int: number) => (int>=10 ? int : `0${int}`);
export function lengthFormmater(ms: number) {
  const seconds = Math.round((ms/1000)%60);
  const minutes = Math.floor(((ms/1000)%3600)/60);
  const hours = Math.floor(ms/3600000);
  if(hours>0) return `${formatInt(hours)}:${formatInt(minutes)}:${formatInt(seconds)}`;
  if(minutes>0) return `${formatInt(minutes)}:${formatInt(seconds)}`;
  return `00:${formatInt(seconds)}`;
}

export async function pagination(client: Client, message: Message, embeds: Array<MessageEmbed | MessageEmbedOptions>) {
  try {
    let curPage = 1;
    const row = new MessageActionRow()
      .addComponents([{
        type: "BUTTON",
        customId: "prev",
        label: "前一頁",
        style: "SECONDARY"
      }, {
        type: "BUTTON",
        customId: "next",
        label: "下一頁",
        style: "SECONDARY"
      }]);
    const reply = await message.reply({
      embeds: [embeds[0]],
      components: [row]
    });
    const collector = reply.createMessageComponentCollector({
      filter: (interaction) => interaction.user == message.author,
      componentType: "BUTTON",
      idle: 600000,
      dispose: true
    });
    collector
      .on("collect", async (interaction) => {
        switch(interaction.customId) {
          case "prev":
            if(curPage == 1)
              curPage = embeds.length;
            else
              curPage--;
            break;
          case "next":
            if(curPage == embeds.length)
              curPage = 1;
            else
              curPage++;
            break;
        }
        await interaction.update({
          embeds: [embeds[curPage - 1]]
        });
      })
      .on("end", async () => {
        if(!!message.channel.messages.resolve(reply.id)) await reply.edit({
          components: []
        });
      });
  } catch(err) {
    client.logger.error(err);
  }
}

export function capFirstLetter(string: string) {
  const firstLetter = string.slice(0, 1).toUpperCase();
  const restString = string.slice(1);
  return firstLetter + restString;
}

export function aliasesString(aliases: Array<string>) {
  let string = "";
  for(let i = 0; i < aliases.length; i++) {
    if((i + 1) == aliases.length)
      string = string.concat(`\`${aliases[i]}\``);
    else
      string = string.concat(`\`${aliases[i]}\`, `);
  }
  return string;
}

export function get247(client: Client, guild: string) {
  const twentyFourSeven = Number(client.config.get(`${guild}_247`));
  return (!!twentyFourSeven ? true : false);
}