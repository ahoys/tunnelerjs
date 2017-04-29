// Core requirements.
const Discord = require('discord.js');
const Client = new Discord.Client();

// Debug
// Handles printing and logging of various events.
const Debug = require('./util/module.inc.debug')();

// Settings
// All the required application specific settings are found here.
// Settings are read-only.
const Settings = require('./util/module.inc.settings')(Debug);

// Strings
// This loads the localization and other pre-set strings.
// The second parameter should match the strings given in config/strings.json.
// Default values should always be given!
const Strings = require('./util/module.inc.strings')(
    Debug, Settings.get('default_localization'));

// Auth
// Loads the essential authentication information.
const Auth = require('./util/module.inc.auth')(Debug);

// Parser
// The received messages can be sanitized with a parser before
// further processing.
const Parser = require('./util/module.inc.parser')(Debug);

// Commands
// All the official and custom commands are loaded and executed here.
const Commands = require('./util/module.inc.commands')(Debug, Auth, Strings, Client);

Client.login(Auth.token);

/**
 * The initial connection handler.
 */
Client.on('ready', () => {
    try {
        const { user, guilds } = Client;
        Debug.print(`Registered owner ${Auth.owner}.`, 'MAIN');
        Debug.print(`Serving ${guilds.array().length} server(s).`, 'MAIN', false);
        Debug.log(`Serving: ${guilds.map(x => x.name)}`, 'MAIN')
        Debug.print(`Successfully logged in as ${user.username}.\n
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
        const public = !!guild;
        // Look for commands.
        if (Message.isMentioned(user)) {
            // The bot is mentioned.
            if (Parser.isSafe(content)) {
                const parsedContent = Parser.trim(content);
                const key = Commands.readCommandKey(parsedContent);
                console.log(`${author.username}: ${parsedContent}`);
                console.log(`key: ${key}`);
            }
        }
    } catch (e) {
        Debug.print('Reading a message failed. The process will now exit.', 'MAIN ERROR', true, e);
        process.exit(1);
    }
});

/**
 * When a message is altered handler.
 */
Client.on('messageUpdate', (oldMessage, newMessage) => {
    try {
        const { oldContent, author, guild } = oldMessage;
        const { content } = newMessage;
        const public = !!guild;
    } catch (e) {
        Debug.print('Reading a modified message failed. The process will now exit.', 'MAIN ERROR', true, e);
        process.exit(1);
    }
});

/**
 * When pins are updated.
 */
Client.on('channelPinsUpdate', (channel, time) => {
    try {
        const { id, type } = channel;
    } catch (e) {
        Debug.print('Channel pins update reader failed. The process will now exit.', 'MAIN ERROR', true, e);
        process.exit(1);
    }
});
