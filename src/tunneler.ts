import { Client, Message } from "discord.js";
import { config } from "dotenv";
import { p } from "logscribe";
import { loadCommands } from "./loadCommands";
import { loadMiddleware } from "./loadMiddleware";

config({ path: __dirname + "/.env" });

const token: string = process.env["discord.token"] ?? "";
const applicationId: string = process.env["discord.application_id"] ?? "";
const ownerId: string = process.env["discord.owner_id"] ?? "";
const whitelisted: string[] =
  process.env["bot.whitelisted_roles"]?.split(",") ?? [];
const isDevelopment: boolean = process.env["bot.development"] === "true";

export interface IFlags {
  isDirectMessage: boolean;
  isWhitelisted: boolean;
  isAdmin: boolean;
  isOwner: boolean;
  isDevelopment: boolean;
}

export type TCmd = (client: Client, message: Message, flags?: IFlags) => void;
export type TMw = (client: Client, message: Message, flags?: IFlags) => void;

let commands: { name: string; command: TCmd }[] = [];
let middleware: TMw[] = [];

// This is the main Discord-client.
const client: Client = new Client();

/**
 * Logs into Discord.
 */
let reconnect: ReturnType<typeof setTimeout> | null = null;
const login = () => {
  client.login(token).catch((err) => {
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
    if (client && client.user && message.author.id !== applicationId) {
      const isMentioned = message.mentions.has(client.user.id);
      const isDirectMessage = !message.guild;
      const command = message.content.split(" ")[isDirectMessage ? 0 : 1] ?? "";
      const isAdmin = message.member?.hasPermission("ADMINISTRATOR") ?? false;
      const isOwner = message.author.id === ownerId;
      const isWhitelisted = !!message.member?.roles.cache.find((r) =>
        whitelisted.includes(r.id)
      );
      if (isMentioned && command) {
        // The user seems to be asking for a command.
        // Look for the given command. If found, execute.
        const foundCmd = commands.find((cmd) => cmd.name === command);
        if (foundCmd) {
          foundCmd.command(client, message, {
            isDirectMessage,
            isWhitelisted,
            isAdmin,
            isOwner,
            isDevelopment,
          });
        }
      }
      if (!isDirectMessage) {
        middleware.forEach((cmd) => {
          cmd(client, message, {
            isDirectMessage,
            isWhitelisted,
            isAdmin,
            isOwner,
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
    loadMiddleware()
      .then((mws) => {
        middleware = [...mws];
        p("Enabled middleware:", middleware.map((c) => c.name).join(", "));
        login();
      })
      .catch(() => {
        p("Failed to load middleware.");
      });
  })
  .catch(() => {
    p("Failed to load commands.");
  });
