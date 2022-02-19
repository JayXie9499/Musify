import { Node } from "erela.js"
import { Event } from "../.."

export const EVENT: Event = {
  name: "nodeDisconnect",
  lib: "erela",
  run: (client, node: Node) => client.logger.warn(`與Lavalink伺服器斷線: ${node.options.identifier}(${node.options.port})`)
}