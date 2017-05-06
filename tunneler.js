// Core requirements
const Discord = require('discord.js');
const Client = new Discord.Client();

// Utilities
const Debug = require('./util/module.inc.debug')();
const Parser = require('./util/module.inc.parser')(Debug);

// Authentication data
// Includes token, id and owner.
const Auth = require('./auth')(Debug);
const AuthMap = Auth.initialize();

// Commands data
// All the available commands mapped into a special object frames.
const Commands = require('./commands')(Debug);
const CommandsMap = Commands.initialize();

// Guilds data
// Each guild can have its own commands, settings and translations.
const Guilds = require('./guilds')(Debug, CommandsMap);
const GuildsMap = Guilds.initialize();

Client.login(AuthMap.token);

/**
 * The initial connection handler.
 */
Client.on('ready', () => {
    try {
        const { user, guilds } = Client;
        guilds.forEach((Guild) => {
            if (!GuildsMap[Guild.id]) {
                Debug.print(`Could not find configuration for a guild (${Guild.id}).`, 'MAIN');
            }
        });
        Debug.print(`Serving ${guilds.array().length} server(s).`, 'MAIN');
        Debug.print(`Logged in as ${user.username}.\n
        Initialization ready, monitoring activity...\n`, 'MAIN');
    } catch (e) {
        Debug.print('Client ready failed. The process will now exit.', 'MAIN ERROR', true, e);
        process.exit(1);
    }
});

/**
 * A disconnection handler.
 */
Client.on('disconnected', () => {
    try {
        Debug.print('Disconnected.', 'MAIN');
        process.exit(0);
    } catch (e) {
        Debug.print('Disconnecting failed. The process will now exit.', 'MAIN ERROR', true, e);
        process.exit(1);
    }
});

/**
 * On joining a new guild.
 */
Client.on('guildCreate', (guild) => {
    try {
        const { name } = guild;
        Debug.print(`Joined a new guild: ${name}.`);
    } catch (e) {
        Debug.print('Joining a guild failed. The process will now exit.', 'MAIN ERROR', true, e);
        process.exit(1);
    }
});

/**
 * The main message handler.
 */
Client.on('message', Message => {
    try {
        const { content, author, guild } = Message;
        const { user } = Client;
        // Listen for direct commands.
        if (Message.isMentioned(user)) {
            if (Parser.isSafe(content)) {
                const string = Parser.trim(content);
                const thisGuild = GuildsMap[guild.id];
                const cmdKey = Parser.firstMatch(Object.keys(thisGuild.commands), string);
                if (cmdKey !== undefined && thisGuild.commands[cmdKey]) {
                    thisGuild.commands[cmdKey].execute(Message, Client);
                }
            }
        }
    } catch (e) {
        Debug.print('Reading a message failed. The process will now exit.', 'MAIN ERROR', true, e);
        process.exit(1);
    }
});
