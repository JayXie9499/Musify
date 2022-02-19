import dotenv from "dotenv"
import Discord, { Collection, Intents } from "discord.js"
import { Manager } from "erela.js"
import { Command, Logger, Handlers, AutoLeave, Emojis } from "."
import Enmap from "enmap"

dotenv.config();

export class Client extends Discord.Client {
  config: Enmap<string, string>;
  emotes: Emojis;
  commands: Collection<string, Command>;
  aliases: Collection<string, Command>;
  logger: Logger;
  manager: Manager;
  private handlers: Handlers;
  
  constructor() {
    super({
      shards: "auto",
      allowedMentions: {
        repliedUser: false
      },
      restWsBridgeTimeout: 100,
      restTimeOffset: 0,
      sweepers: {
        messages: {
          interval: 7200,
          lifetime: 3600
        }
      },
      intents: new Intents(641),
      presence: {
        activities: [{
          type: "PLAYING",
          name: "+help 查詢指令"
        }]
      }
    });
    this.config = new Enmap({
      name: "guild_config"
    });
    this.emotes = require("../emojis.json");
    this.commands = new Collection();
    this.aliases = new Collection();
    this.handlers = new Handlers(this);
    this.logger = new Logger(this);
    this.manager = new Manager({
      nodes: [{
        identifier: "DigitalOcean",
        host: "159.223.69.177",
        password: "pass",
        port: 443,
        retryAmount: Infinity,
        retryDelay: 3
      }],
      send: (id, payload) => {
        const guild = this.guilds.resolve(id);
        if(guild) guild.shard.send(payload);
      }
    });
  }

  async start() {
    this.handlers.loadEvents();
    this.handlers.loadCommands();
    await this.login(process.env.Token);
    this.manager.init(this.user!.id);
    AutoLeave(this);
  }
}

const client = new Client();
client.start();