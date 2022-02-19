import { Client, get247 } from ".."

export function AutoLeave(client: Client) {
  client.manager.on("queueEnd", (player) => {
    if(get247(client, player.guild)) return;
    player.set("leave_cd", false);
    const destroyPlayer = setTimeout(() => {
      if(!player.get("leave_cd")) player.destroy();
      clearTimeout(destroyPlayer);
    }, 300000);
  });
}