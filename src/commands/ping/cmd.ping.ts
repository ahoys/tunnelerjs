import { Client, Message } from "discord.js";
import { p } from "logscribe";
import { IFlags } from "../../tunneler";

/**
 * Returns the current latencies as a reply.
 * @param client
 * @param message
 * @param flags
 */
const ping = (client: Client, message: Message, flags: IFlags): void => {
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
