import { VoicePacket } from "erela.js"
import { Event } from "../.."

export const EVENT: Event = {
  name: "raw",
  lib: "djs",
  run: (client, data: VoicePacket) => client.manager.updateVoiceState(data)
}