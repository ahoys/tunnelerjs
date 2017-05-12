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
        const {user, guilds} = Client;
        guilds.forEach((Guild) => {
            if (!GuildsMap[Guild.id]) {
                Debug.print(
                    `Could not find configuration for a guild (${Guild.id}).`,
                    'MAIN'
                    );
            }
        });
        Debug.print(`Serving ${guilds.array().length} server(s).`, 'MAIN');
        Debug.print(`Logged in as ${user.username}.\n
        Initialization ready, monitoring activity...\n`, 'MAIN');
    } catch (e) {
        Debug.print(
            'Client ready failed. The process will now exit.',
            'MAIN ERROR', true, e
            );
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
        Debug.print(
            'Disconnecting failed. The process will now exit.',
            'MAIN ERROR', true, e
            );
        process.exit(1);
    }
});

/**
 * The main message handler.
 */
Client.on('message', (Message) => {
    try {
        const {content, guild} = Message;
        const {user} = Client;
        // Listen for direct commands only.
        if (!Message.isMentioned(user) || !Parser.isSafe(content)) return;
        const thisGuild = GuildsMap[guild.id];
        const cmdKey = Parser.firstMatch(
            Object.keys(thisGuild.commands),
            Parser.trim(content)
        );
        // The command must exist.
        if (thisGuild.commands[cmdKey] === undefined) return;
        // Start asynchronous command execution.
        new Promise((resolve, reject) => {
            const perfMeasure = process.hrtime();
            const response = thisGuild.commands[cmdKey]
            .execute(Message, Client);
            Debug.log(
                `A command (${cmdKey}) took `
                + `${process.hrtime(perfMeasure)[0]}s and `
                + `${process.hrtime(perfMeasure)[1]}ms to execute.`,
                'MAIN'
            );
            if (response === undefined) {
                reject(`The executing command returned undefined.`);
            }
            resolve({Message, response});
        }).then((payload) => {
            if (
                typeof payload.response === 'string' &&
                payload.response.length
            ) {
                // The command returned a textual string.
                // Make the bot talk.
                Message.reply(payload.response);
            }
        }).catch((e) => {
            Debug.print(`A command was rejected. See the log.`,
            `MAIN ERROR`, true, e);
        });
    } catch (e) {
        Debug.print(
            `Reading a message failed. The process will now exit.`,
            `MAIN ERROR`, true, e);
        process.exit(1);
    }
});
