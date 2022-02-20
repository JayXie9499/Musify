import { Player } from "erela.js"
import { Event } from "../.."

export const EVENT: Event = {
  name: "playerMove",
  lib: "erela",
  run: (_, player: Player, __, nChannelId) => player.voiceChannel = nChannelId
}