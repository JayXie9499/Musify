import { Message, PermissionResolvable } from "discord.js"
import { Client } from ".."

export interface Command {
  name: string;
  description: string;
  usage: string;
  category: "Info" | "Voice" | "Song" | "Queue" | "Settings" | "Owner";
  aliases?: Array<string>;
  owner?: boolean;
  perm?: PermissionResolvable;
  run: (client: Client, message: Message, args: Array<string>, commandName: string) => any;
}

export interface Event {
  name: string;
  lib: "djs" | "erela";
  run: (client: Client, ...args: Array<any>) => any;
}

export interface Emojis {
  v: string;
  x: string;
  diamond: string;
}