import { Client, Message } from "discord.js";
import { p } from "logscribe";
import { IFlags } from "../../tunneler";

const roles: string[] =
  typeof process.env["cmd.role.allowed_role_ids"] === "string"
    ? process.env["cmd.role.allowed_role_ids"].split(",")
    : [];

const allowMultiple: boolean =
  typeof process.env["cmd.role.allow_multiple_roles"] === "string"
    ? process.env["cmd.role.allow_multiple_roles"] === "true"
    : false;
/**
 * Gives the requested role for the requester, if allowed.
 */
const role = (client: Client, message: Message, flags: IFlags): void => {
  try {
    const { isDirectMessage } = flags;
    if (!isDirectMessage && roles.length) {
      const requested = message.content.split(" ")[2]?.toLowerCase();
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

export default role;
