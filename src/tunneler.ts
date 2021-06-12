import { Client } from "discord.js";
import { config } from "dotenv";
import { p } from "logscribe";
import { rapidMessages } from "./heuristics/heuristic.rapidMessages";

config({ path: __dirname + "/.env" });
const {
  BOT_TOKEN,
  APPLICATION_ID,
  OWNER_ID,
  WHITELISTED_ROLE_ID,
  DEVELOPMENT,
} = process.env;
const isDevelopment = DEVELOPMENT === "true";
const whitelistedRoleId =
  typeof WHITELISTED_ROLE_ID === "string" && WHITELISTED_ROLE_ID !== ""
    ? WHITELISTED_ROLE_ID
    : "";

if (
  typeof BOT_TOKEN !== "string" ||
  typeof APPLICATION_ID !== "string" ||
  typeof OWNER_ID !== "string"
) {
  throw new Error("Missing the .env file that configures the bot.");
}

export interface IDbUser {
  index: number;
  timestamps: number[];
  contentLengths: number[];
}
interface IDb {
  [key: string]: IDbUser;
}

const client = new Client();
const db: IDb = {};

/**
 * Logs into Discord.
 */
let reconnect: ReturnType<typeof setTimeout> | null = null;
const login = () => {
  client.login(BOT_TOKEN).catch((err) => {
    p(err);
    console.error("Failed to login.");
    if (reconnect) {
      clearTimeout(reconnect);
    }
    reconnect = setTimeout(() => {
      login();
    }, 10240);
  });
};

/**
 * Something went wrong with the connection
 * or Discord.
 *
 * Try to re-login.
 */
client.on("error", () => {
  try {
    p("Connection issues or some other form of a failure detected.");
    login();
  } catch (err) {
    p(err);
  }
});

/**
 * The bot is ready to function, meaning
 * that we're connected to Discord.
 */
client.on("ready", () => {
  p(
    "Successfully connected to Discord!\n" +
      `Username: ${client.user?.username}\n` +
      `Verified: ${client.user?.verified}\n` +
      "Waiting for events..."
  );
});

/**
 * All new messages (from non-trusted authors) are
 * investigated.
 */
client.on("message", (message) => {
  try {
    const { member, author } = message;
    const isWhitelisted =
      whitelistedRoleId !== "" &&
      member?.roles?.cache.some((r) => r.id === whitelistedRoleId);
    // We won't analyze everyone.
    // If the member is whitelisted or the owner, we'll skip the message.
    if (
      (!isWhitelisted &&
        member &&
        member.bannable &&
        member.kickable &&
        author.id !== OWNER_ID) ||
      isDevelopment
    ) {
      // Update the database.
      const { createdTimestamp, content } = message;
      const dbUser: IDbUser = db[author.id]
        ? { ...db[author.id] }
        : {
            index: 0,
            timestamps: [],
            contentLengths: [],
          };
      const { index } = dbUser;
      dbUser.index = index >= 8 ? 0 : index + 1;
      dbUser.timestamps[index] = createdTimestamp;
      dbUser.contentLengths[index] = content.length;
      // Save the changes.
      db[author.id] = dbUser;
      // Run heuristics.
      let failed = false;
      let reason = "";
      if (rapidMessages(dbUser)) {
        failed = true;
        reason = "Too rapid messaging.";
      }
      // Condemn the user.
      if (failed && member && message.guild) {
        if (message.guild) {
          p(
            "Banning " +
              author.username +
              " " +
              member.id +
              " from " +
              message.guild.name +
              " for " +
              reason.toLowerCase()
          );
        } else {
          p(
            "Banning " +
              author.username +
              " " +
              member.id +
              " for " +
              reason.toLowerCase()
          );
        }
        member
          .ban({
            days: 7,
            reason,
          })
          .then(() => {
            delete db[author.id];
          });
      }
    }
  } catch (err) {
    p(err);
  }
});

login();
