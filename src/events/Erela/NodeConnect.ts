import { Node } from "erela.js"
import { Event } from "../.."

export const EVENT: Event = {
  name: "nodeConnect",
  lib: "erela",
  run: (client, node: Node) => client.logger.info(`連上Lavalink伺服器: ${node.options.identifier}(${node.options.port})`)
}