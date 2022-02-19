import { MessageEmbedOptions, PremiumTier, TextChannel } from "discord.js"
import { Command, pagination } from "../.."

export const COMMAND: Command = {
  name: "servers",
  description: "顯示機器人所在的全部伺服器",
  usage: "servers [伺服器ID]",
  aliases: ["server", "sv"],
  category: "Owner",
  owner: true,
  run: async (client, message, args) => {
    try {
      const guilds = client.guilds.cache
        .filter((guild) => guild.available)
        .map((guild) => guild);
      if(!args.length) {
        const embeds: Array<MessageEmbedOptions> = [];
        let list = "";
        for(let i = 0; i < guilds.length; i++) {
          list = list.concat(`\n\`${i + 1}.\` ${guilds[i].name}\n> ${guilds[i].id}\n`);
          if(((i + 1) % 10) == 0 || (i + 1) == guilds.length) {
            embeds.push({
              title: "伺服器列表",
              description: list,
              color: "RANDOM"
            });
            list = "";
          }
        }
        if(embeds.length > 1)
          await pagination(client, message, embeds);
        else
          await message.reply({
            embeds: [embeds[0]]
          });
      } else {
        const guildId = args[0];
        const guild = client.guilds.resolve(guildId);
        if(!guild) return await message.reply(`${client.emotes.x} **找不到伺服器!**`);
        const owner = guild.members.resolve(guild.ownerId)!;
        const invite = await guild.invites.create(
          guild.channels.cache
            .filter((channel) => channel.type == "GUILD_TEXT")
            .first()! as TextChannel, 
          {
            maxAge: 300,
            maxUses: 1
          }
        );
        await message.reply({
          embeds: [{
            author: {
              name: guild.name,
              iconURL: guild.iconURL({
                dynamic: true,
                size: 64
              })!,
              url: invite.url
            },
            thumbnail: {
              url: guild.iconURL({
                dynamic: true,
                size: 64
              })!
            },
            description: guild.description || undefined,
            fields: [{
              name: `${client.emotes.diamond} __**服主**__`,
              value: `${owner}(\`${owner.user.tag}\`)`,
              inline: true
            }, {
              name: `${client.emotes.diamond} __**成員總數**__`,
              value: `\`${guild.memberCount}\``,
              inline: true
            }, { name: "\u200b", value: "\u200b", inline: true }, {
              name: `${client.emotes.diamond} __**合作夥伴**__`,
              value: `\`${(guild.partnered ? "是" : "否")}\``,
              inline: true
            }, {
              name: `${client.emotes.diamond} __**加成等級**__`,
              value: `\`${getBoostTier(guild.premiumTier)}\``,
              inline: true
            }, { name: "\u200b", value: "\u200b", inline: true }],
            color: "RANDOM"
          }]
        });
      }
    } catch(err) {
      client.logger.error(err);
    }
  }
}

function getBoostTier(tier: PremiumTier) {
  if(tier == "TIER_3") return "等級3";
  if(tier == "TIER_2") return "等級2"
  if(tier == "TIER_1") return "等級1"
  return "等級0";
}