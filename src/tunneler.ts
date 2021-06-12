import { Client, Message } from "discord.js";
import { config } from "dotenv";
import { p } from "logscribe";
import { loadCommands } from "./loadCommands";
import { loadMiddlewares } from "./loadMiddlewares";

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

export interface IFlags {
  isDirectMessage: boolean;
  isWhitelisted: boolean;
  isAdmin: boolean;
  isDevelopment: boolean;
}

export type TCmd = (client: Client, message: Message, flags?: IFlags) => void;
export type TMw = (client: Client, message: Message, flags?: IFlags) => void;

let commands: { name: string; command: TCmd }[] = [];
let middlewares: TMw[] = [];

// This is the main Discord-client.
const client: Client = new Client();

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
    if (client && client.user && message.author.id !== APPLICATION_ID) {
      const isMentioned = message.mentions.has(client?.user?.id);
      const isDirectMessage = !message.guild;
      const command = message.content.split(" ")[isDirectMessage ? 0 : 1] ?? "";
      const isAdmin = message.member?.hasPermission("ADMINISTRATOR") ?? false;
      const isWhitelisted =
        whitelistedRoleId !== "" &&
        !!message.member?.roles?.cache.some((r) => r.id === whitelistedRoleId);
      if (isMentioned && command) {
        // The user seems to be asking for a command.
        // Look for the given command. If found, execute.
        const foundCmd = commands.find((cmd) => cmd.name === command);
        if (foundCmd) {
          foundCmd.command(client, message, {
            isDirectMessage,
            isWhitelisted,
            isAdmin,
            isDevelopment,
          });
        }
      }
      if (!isDirectMessage) {
        middlewares.forEach((cmd) => {
          cmd(client, message, {
            isDirectMessage,
            isWhitelisted,
            isAdmin,
            isDevelopment,
          });
        });
      }
    }
  } catch (err) {
    p(err);
  }
});

// Load commands and then login to Discord.
loadCommands()
  .then((cmds) => {
    commands = [...cmds];
    p("Enabled commands:", commands.map((c) => c.name).join(", "));
    loadMiddlewares()
      .then((mws) => {
        middlewares = [...mws];
        p("Enabled middlewares:", middlewares.map((c) => c.name).join(", "));
        login();
      })
      .catch(() => {
        p("Failed to load middlewares.");
      });
  })
  .catch(() => {
    p("Failed to load commands.");
  });
