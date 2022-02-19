import { Event } from "../.."

export const EVENT: Event = {
  name: "error",
  lib: "djs",
  run: (client, error: Error) => {
    const indent = "  ";
    const err = `Error {\n` +
                `${indent}name: "${error.name}"\n` +
                `${indent}message: "${error.message}"\n` +
                `${(error.stack ? `${indent}stack: "${error.stack}"\n` : "")}` +
                `}`;
    client.logger.error(err);
  }
}