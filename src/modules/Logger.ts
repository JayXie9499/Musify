import { Guild, TextChannel } from "discord.js"
import Enmap from "enmap"
import { Client } from ".."

export class Logger {
  config: Enmap<"guild" | "channel", string>;
  private client: Client;
  private guild: Guild | undefined;
  private channel: TextChannel | undefined;

  constructor(client: Client) {
    this.client = client;
    this.config = new Enmap({
      name: "logger"
    });
  }

  info(message: any) {
    const time = this.time;
    console.log(`[${time[0]}] [INFO] ${message}`);
    this.discordLogger("ini", time[1], message);
  }

  warn(message: any) {
    const time = this.time;
    console.log(`[${time[0]}] [WARN] ${message}`);
    this.discordLogger("fix", time[1], message);
  }

  error(message: any) {
    const time = this.time;
    console.log(`[${time[0]}] [ERROR] ${message}`);
    this.discordLogger("css", time[1], message);
  }

  private get time() {
    const date = new Date();
    const hr = date.getHours();
    const min = date.getMinutes();
    const sec = date.getSeconds();
    const timestamp = Math.round(date.getTime() / 1000);
    return [`${date.toLocaleDateString()}-${hr}:${min}:${sec}`, `<t:${timestamp}:d>-<t:${timestamp}:T>`];
  }
  
  private getChannel() {
    const guild = this.client.guilds.resolve(this.config.get("guild")!);
    if(!guild) return this.guild = undefined;
    const channel = guild.channels.resolve(this.config.get("channel")!);
    if(!channel || channel.type !== "GUILD_TEXT") return this.channel = undefined;
    this.guild = guild;
    this.channel = channel;
  }

  private async discordLogger(md: "ini" | "fix" | "css", time: string, msg: any) {
    this.getChannel();
    if(!this.guild || !this.channel) return;
    await this.channel.send({
      embeds: [{
        description: `${time}\n\`\`\`${md}\n${msg}\`\`\``,
        color: "WHITE"
      }]
    });
  }
}