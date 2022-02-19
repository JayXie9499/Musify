import { Command, get247 } from "../.."

export const COMMAND: Command = {
  name: "join",
  description: "使機器人加入語音",
  usage: "join",
  category: "Voice",
  aliases: ["summon"],
  run: async (client, message) => {
    try {
      const { guildId, member, channelId } = message;
      const mVoice = member!.voice.channel;
      if(!mVoice) return await message.reply(`${client.emotes.x} **你不在語音頻道裡!**`);
      const player = client.manager.create({
        guild: guildId!,
        textChannel: channelId
      });
      if(!player.get("leave_cd")) player.set("leave_cd", false);
      if(!!player.voiceChannel) return await message.reply(`${client.emotes.v} **我已經在語音頻道裡了!**`);
      player.setVoiceChannel(mVoice.id);
      player.connect();
      await message.reply(`${client.emotes.v} **加入** ${mVoice} **!**`);
      if(!get247(client, guildId!)) {
        const destroyPlayer = setTimeout(() => {
          if(!player.get("leave_cd")) player.destroy();
          clearTimeout(destroyPlayer);
        }, 300000);
      }
    } catch(err) {
      client.logger.error(err);
    }
  }
}