import { Player } from "erela.js"
import { Event } from "../.."

export const EVENT: Event = {
  name: "socketClosed",
  lib: "erela",
  run: (client, player: Player) => {
    const guild = client.guilds.resolve(player.guild);
    const nChannel = guild?.me?.voice.channel;
    if(!nChannel) return player.destroy();
    player.pause(true);
    player.pause(false);
  }
}