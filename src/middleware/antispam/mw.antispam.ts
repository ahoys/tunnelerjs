import { Client, Message } from "discord.js";
import { p } from "logscribe";
import { IFlags } from "../../tunneler";
import { rapidMessages } from "./heuristics/heuristic.rapidMessages";
import { repeatingMessages } from "./heuristics/heuristic.repeatingMessages";
import { IGuildSettings } from "../../loadSettings";

export interface IDbUser {
  index: number;
  warnings: number;
  timestamps: number[];
  content: string[];
  contentLengths: number[];
}

interface IDb {
  [key: string]: IDbUser;
}

const db: IDb = {};
const MAX_DB_SIZE = 16;

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
    const rapidMessagesAvg: number =
      typeof settings["mw.antispam.rapid_messages_avg"] === "string"
        ? Number(settings["mw.antispam.rapid_messages_avg"])
        : 1024;
    const repeatingMessagesPercentage: number =
      typeof settings["mw.antispam.repeating_messages_percentage"] === "string"
        ? Number(settings["mw.antispam.repeating_messages_percentage"])
        : 0.5;
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
            content: [],
            contentLengths: [],
          };
      // Update the user with this new entry.
      const index = dbUser.index;
      const warnings = dbUser.warnings;
      dbUser.timestamps[index] = message.createdTimestamp;
      dbUser.content[index] = message.content;
      dbUser.contentLengths[index] = message.content.length;
      dbUser.index = index < MAX_DB_SIZE - 1 ? index + 1 : 0;
      // Investigate if the user has violated anything based on
      // the recorded information.
      if (
        rapidMessages(dbUser, rapidMessagesAvg) ||
        repeatingMessages(dbUser, repeatingMessagesPercentage, dbUser.warnings)
      ) {
        dbUser.warnings = dbUser.warnings + 1;
      }
      if (dbUser.warnings > maxWarnings) {
        // Kick here.
        dbUser.warnings = 0;
        message.member
          ?.ban({
            days: banDays,
            reason: `Caught spamming and did not stop after ${maxWarnings} warnings.`,
          })
          .catch((err) => {
            p(err);
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
