import cmdJson from "./cmd.role.json";
import { Client, Message } from "discord.js";
import { p } from "logscribe";
import { IFlags } from "../../tunneler";
import { IGuildSettings } from "../../loadSettings";

/**
 * Gives the requested role for the requester, if allowed.
 */
const role = (
  client: Client,
  message: Message,
  settings: IGuildSettings,
  flags: IFlags
): void => {
  try {
    const { isDirectMessage } = flags;
    const roles: string[] =
      typeof settings["cmd.role.allowed_role_ids"] === "string"
        ? settings["cmd.role.allowed_role_ids"].split(",")
        : [];
    const allowMultiple: boolean =
      typeof settings["cmd.role.allow_multiple_roles"] === "string"
        ? settings["cmd.role.allow_multiple_roles"] === "true"
        : false;
    if (!isDirectMessage && roles.length) {
      // Transform @tunneler role something something -> something something.
      const inArr = message.content.split(" ");
      inArr.shift();
      inArr.shift();
      const requested = inArr.join(" ").toLowerCase();
      const theRole = message.guild?.roles.cache.find(
        (r) => r.name.toLowerCase() === requested
      );
      if (
        theRole &&
        roles.includes(theRole.id) &&
        !message.member?.roles.cache.some((r) => r.id === theRole.id)
      ) {
        // Remove other roles if requested.
        if (!allowMultiple) {
          roles.forEach((role) => {
            if (role !== theRole.id) {
              const duplicateRole = message.guild?.roles.cache.find(
                (guildRole) => guildRole.id === role
              );
              if (duplicateRole) {
                message.member?.roles
                  .remove(duplicateRole)
                  .catch((err) => p(err));
              }
            }
          });
        }
        // Add the new role.
        message.member?.roles
          .add(theRole)
          .then(() => {
            message.reply("role set.").catch((err) => p(err));
          })
          .catch((err) => p(err));
      } else {
        message.reply("invalid role requested.").catch((err) => p(err));
      }
    }
  } catch (err) {
    p(err);
  }
};

export const slashCommands = cmdJson;

export default role;
