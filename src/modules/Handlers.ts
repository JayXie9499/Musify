import { readdirSync } from "fs"
import { Client, Event, Command } from ".."

export class Handlers {
  private client: Client;

  constructor(client: Client) {
    this.client = client;
  }

  loadEvents() {
    readdirSync(`${__dirname}/../events`, {
      withFileTypes: true
    }).filter((item) => item.isDirectory())
      .forEach((dir) => {
        readdirSync(`${__dirname}/../events/${dir.name}`)
          .filter((file) => file.endsWith("js"))
          .forEach((file_name) => {
            const event: Event = require(`../events/${dir.name}/${file_name}`).EVENT;
            switch(event.lib) {
              case "djs":
                this.client.on(event.name, event.run.bind(null, this.client));
                break;
              case "erela":
                this.client.manager.on(event.name as "socketClosed", event.run.bind(null, this.client));
                break;
            }
          });
      });
    this.client.logger.info("指令載入完成!");
  }

  loadCommands() {
    readdirSync(`${__dirname}/../commands`, {
      withFileTypes: true
    }).filter((item) => item.isDirectory())
      .forEach((dir) => {
        readdirSync(`${__dirname}/../commands/${dir.name}`)
          .filter((file) => file.endsWith("js"))
          .forEach((file_name) => {
            const command: Command = require(`../commands/${dir.name}/${file_name}`).COMMAND;
            this.client.commands.set(command.name, command);
            if(command.aliases)
              for(const alias of command.aliases) this.client.aliases.set(alias, command);
          });
      });
    this.client.logger.info("事件載入完成!");
    this.runCommands();
  }

  private runCommands() {
    this.client.on("messageCreate", async (message) => {
      const { guildId, author, member, content } = message;
      if(!guildId || !member || author.bot) return;
      const prefix = this.client.config.get(`${guildId}_prefix`) || "+";
      if(!content.startsWith(prefix)) return;
      const args = content.slice(prefix.length).split(" ");
      const commandName = args.shift()!;
      const command = this.client.commands.get(commandName) || this.client.aliases.get(commandName);
      if(!command) return;
      if(command.perm && !member.permissions.has(command.perm))
        await message.reply({
          embeds: [{
            description: `${this.client.emotes.x} **你沒有權限使用此指令!**`,
            color: "RED"
          }]
        });
      else if(command.owner && member.id !== "263613963034427392")
        return;
      else
        command.run(this.client, message, args, commandName);
    });
  }
}