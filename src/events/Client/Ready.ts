import { Event } from "../.."

export const EVENT: Event = {
  name: "ready",
  lib: "djs",
  run: (client) => client.logger.info(`${client.user!.tag} 已上線!`)
}