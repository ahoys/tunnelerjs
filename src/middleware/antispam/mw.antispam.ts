import { Client, Message } from "discord.js";
import { p } from "logscribe";
import { IFlags } from "../../tunneler";
import { rapidMessages } from "./heuristics/heuristic.rapidMessages";
import { IGuildSettings } from "../../loadSettings";

export interface IDbUser {
  index: number;
  warnings: number;
  timestamps: number[];
  contentLengths: number[];
}

interface IDb {
  [key: string]: IDbUser;
}

const db: IDb = {};

/**
 * An antispam middleware with various heuristics against
 * various spammers.
 */
const antispam = (
  client: Client,
  message: Message,
  settings: IGuildSettings,
  flags: IFlags
): void => {
  try {
    const { isWhitelisted, isAdmin, isDevelopment } = flags;
    const maxWarnings: number =
      typeof settings["mw.antispam.warnings"] === "string"
        ? Number(settings["mw.antispam.warnings"])
        : 2;
    const banDays: number =
      typeof settings["mw.antispam.ban_days"] === "string"
        ? Number(settings["mw.antispam.ban_days"])
        : 1;
    const limit: number =
      typeof settings["mw.antispam.rapid_messaging_avg"] === "string"
        ? Number(settings["mw.antispam.rapid_messaging_avg"])
        : 1024;
    if (
      (!isWhitelisted && !isAdmin && message.member?.bannable) ||
      isDevelopment
    ) {
      // Load investigated user.
      const dbUser: IDbUser = db[message.author.id]
        ? { ...db[message.author.id] }
        : {
            index: 0,
            warnings: 0,
            timestamps: [],
            contentLengths: [],
          };
      // Update the user with this new entry.
      const index = dbUser.index;
      const warnings = dbUser.warnings;
      dbUser.timestamps[index] = message.createdTimestamp;
      dbUser.contentLengths[index] = message.content.length;
      dbUser.index = index < 7 ? index + 1 : 0;
      // Investigate if the user has violated anything based on
      // the recorded information.
      if (rapidMessages(dbUser, limit)) {
        dbUser.warnings = dbUser.warnings + 1;
      }
      if (dbUser.warnings > maxWarnings) {
        // Kick here.
        dbUser.warnings = 0;
        message.member?.ban({
          days: banDays,
          reason: `Caught spamming and did not stop after ${maxWarnings} warnings.`,
        });
      } else if (dbUser.warnings !== warnings) {
        message
          .reply(
            `please stop spamming. You have ${
              maxWarnings - dbUser.warnings
            } warnings left.`
          )
          .catch((err) => {
            p(err);
          });
      }
      // Save the user.
      db[message.author.id] = dbUser;
    }
  } catch (err) {
    p(err);
  }
};

export default antispam;
