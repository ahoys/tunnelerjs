# Tunneler

**Version 1 now released!**

A super lightweight and robust Discord bot platform for your various Discord-needs.

Forget session handling, message handling, permissions and such. _Focus on your core feature needs._

Comes with several ready-to-use commands and middlewares. Like a role assigner and an antispam guard. Use as-is or build _your_ dream bot.

# How to install

### Requirements

- NodeJs
  - Tunneler has been developed against Node 14.
- Basic knowledge about npm and running node applications.
- Basic knowledge about handling Discord applications.

### Installation Steps

1. [Register a new application for the bot](https://discord.com/developers/applications)
2. Download the most recent release from [releases](https://github.com/ahoys/discaptcha/releases).
3. Extract the package and run `npm install` in the extraction folder.
4. Open .env in a text editor and configure the bot (the following are mandatory):

```
discord.token=Your bot's application token.
discord.application_id=Your bot's application id.
discord.owner_id=Your own Discord client id.
```

You are all set. You can run the bot now with a `node tunneler` command. Make sure you give the bot suitable permissions to execute its tasks.

# Commands and middlewares

## What are they?

All the functionality the bot has is based on commands and middlewares. **A command** is something that is given as a command to the bot. **A middleware** is applied to all messages.

You can enable or disable these functionalities in your .env-file:

`cmd.ping=true` ping command enabled.

`cmd.ping=false` ping command disabled.

## List of features

### cmd.ping

A simple ping command that returns the current latency the bot experiences towards the Discord services. Useful for investigating what's going on with Discord.

Usage: `@Tunneler ping`

### mw.antispam

Detects and bans spammers. Makes moderator's day a lot nicer.

[Read more.](https://github.com/ahoys/tunnelerjs/blob/ts-build/src/middlewares/antispam/README.md)

## How to configure commands or middlewares?

Some commands and middlewares do allow special configuration. See their corresponding folder for a README file to learn more.

For example `src/middlewares/antispam/README.md`

# Making custom commands and middleware for the bot

## Technical background

Tunneler will give you a fast access to developing your own commands and middlewares by allowing you to skip all the "how to connect Discord, handle messages, etc." hurdles.

Commands are something that always require two things:

- The bot is either mentioned or the command is given in a direct channel.
- The command is called by its name.
  - For example: `@tunneler ping` where ping is the name of the command.

Middlewares apply to all messages with a one deliberate restriction:

- Direct messages are not monitored.

All commands and middlewares are under a specific folder structure. Commands are in `src/commands` and middleware in `src/middlewares`.

## Creating files

All of the following instructions apply to middlewares as well. Just replace "command" with "middleware".

1. Create your command folder under `src/commands`
2. Name your index file with a following syntax: `<cmd/mw>.<name>.ts`, for example `cmd.ping.ts`. Js-files may also be supported, not tested and using ts is recommended.

## Coding your function

See `cmd.ping.ts` or `mw.antispam.ts` to get an idea of the ideal end result.

- The given parameters are following: `(client: Client, message: Message, flags: IFlags) => void`
- The function must have a default export. For example: `export default ping`
- The function can't return anything.
- [Client](https://discord.js.org/#/docs/main/stable/class/Client) holds the bot's client.
- [Message](https://discord.js.org/#/docs/main/stable/class/Message) holds the message that triggered the command.

Tip: see the flags interface (IFlags) to learn about utility variables that are in your disposal.

## Enabling your command/middleware

Enabling features is simple in Tunneler. Just add `<cmd/mw>.<name>=true` into your .env-file. For example: `cmd.ping=true`

## Other tips

- Tunneler won't trigger your command if the command name wasn't mentioned. No need to double-check it in your function.
- Using the given flags is a really handy way to make sure not everyone can execute mission critical commands.
- Tunneler doesn't react to its own messages.

# Migrating from Tunneler 0.x to 1.x

### How to proceed?

Tunneler has been 100% rewritten for this new release. This means that the backwards compatibility is broken. If you have your own custom commands made, see the chapter above about making your own commands to migrate your custom commands and middlewares to 1.x and above.

It is highly recommended to remove the old Tunneler and everything related before using the new one.

You can re-use the Discord application (id and token).

### Why so drastic update?

After years of using Tunneler, the exact needs for it have become more clear. The original Tunneler was way over-engineered and had tons of easy pitfalls. It was coded fast to serve a specific purpose and the end result wasn't as well thought as one'd desire. The new 1.x is basically an "how it should've been made" update.
