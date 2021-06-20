import { Client, Message } from "discord.js";
import { p } from "logscribe";
import { IFlags } from "../../tunneler";
import { IGuildSettings } from "../../loadSettings";

/**
 * Returns the current latencies as a reply.
 */
const ping = (
  client: Client,
  message: Message,
  settings: IGuildSettings,
  flags: IFlags
): void => {
  try {
    const { isDirectMessage } = flags;
    const apiLatency = Math.round(client.ws.ping);
    const messageLatency = Date.now() - message.createdTimestamp;
    message.reply(
      `${
        isDirectMessage ? "M" : "m"
      }essage latency: ${messageLatency}ms, API-latency: ${apiLatency}ms.`
    );
  } catch (err) {
    p(err);
  }
};

export default ping;
