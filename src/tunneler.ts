import { Client, Message } from "discord.js";
import { config } from "dotenv";
import { p } from "logscribe";
import { loadSettings } from "./loadSettings";
import { loadCommands, ICommand } from "./loadCommands";
import { loadMiddleware } from "./loadMiddleware";
import { IGuildSettings } from "./loadSettings";
import { getGuildSlashBodies, postSlashCommands } from "./loadSlash";

p("Staring Tunneler...");
config({ path: __dirname + "/.env" });

const token: string = process.env["discord.token"] ?? "";
const applicationId: string = process.env["discord.application_id"] ?? "";
const ownerId: string = process.env["discord.owner_id"] ?? "";
const whitelisted: string[] =
  process.env["bot.whitelisted_roles"]?.split(",") ?? [];
const isDevelopment: boolean = process.env["bot.development"] === "true";

export interface IFlags {
  isDirectMessage: boolean; // In a direct channel, not guild.
  isWhitelisted: boolean; // Has a whitelisted role.
  isAdmin: boolean; // Has administrative permissions.
  isOwner: boolean; // Owner of the bot.
  isDevelopment: boolean; // In development mode.
}

export type TCmd = (
  client: Client,
  message: Message,
  settings: IGuildSettings,
  flags?: IFlags
) => void;
export type TMw = (
  client: Client,
  message: Message,
  settings: IGuildSettings,
  flags?: IFlags
) => void;

const appSettings = loadSettings();
let commands: ICommand[] = [];
let middleware: { name: string; execute: TMw }[] = [];

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
      const settings =
        !message.guild || !message.guild.id
          ? appSettings.defaults
          : typeof appSettings[message.guild.id] === "object"
          ? appSettings[message.guild.id]
          : appSettings.defaults;
      if (isMentioned && command) {
        // The user seems to be asking for a command.
        // Look for the given command. If found, execute.
        const foundCmd = commands.find((cmd) => cmd.name === command);
        if (foundCmd && settings["cmd." + foundCmd.name] === "true") {
          foundCmd.execute(client, message, settings, {
            isDirectMessage,
            isWhitelisted,
            isAdmin,
            isOwner,
            isDevelopment,
          });
        }
      }
      if (!isDirectMessage) {
        middleware.forEach((mw) => {
          if (settings["mw." + mw.name] === "true") {
            mw.execute(client, message, settings, {
              isDirectMessage,
              isWhitelisted,
              isAdmin,
              isOwner,
              isDevelopment,
            });
          }
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
    loadMiddleware()
      .then((mws) => {
        middleware = [...mws];
        p("The settings active", appSettings);
        postSlashCommands(
          applicationId,
          token,
          getGuildSlashBodies(applicationId, appSettings, commands)
        )
          .then(() => {
            login();
          })
          .catch(() => {
            p("Failed to create slash commands. Aborting...");
          });
      })
      .catch(() => {
        p("Failed to load middleware. Aborting...");
      });
  })
  .catch(() => {
    p("Failed to load commands. Aborting...");
  });
