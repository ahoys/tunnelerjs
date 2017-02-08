const Discord = require('discord.js');
const client = new Discord.Client();
const Immutable = require('immutable');

// Strings
const Auth = require("./config/auth.json");
const Strings = require('./config/strings.json');

// Utilities
const Settings = require('./util/module.inc.setting.js')();
const Ban = require('./util/module.inc.ban')();
const AntiSpam = require('./util/module.inc.antispam')();
const Command = require('./util/module.inc.command')();

// Commands
const commands = {
    "about": require('./commands/module.inc.about.js')(),
    "mention": require('./commands/module.inc.mention.js')(),
    "select": require('./commands/module.inc.select.js')(),
    "ping": require('./commands/module.inc.ping')(client),
    "version": require('./commands/module.inc.version')(),
    "say": require('./commands/module.inc.say')(client)
};

const MAX_SERVERS = 8;

let guildSettings = new Immutable.Map({});

client.login(Auth.token);

/**
 * An initial connection handler.
 */
client.on('ready', () => {

    // Make sure the capacity is not exceeded.
    if (client.guilds.array().length > MAX_SERVERS) {
        console.log(`Too many concurrent servers (${client.guilds.array().length > 16}).`);
        console.log(`Servers are limited because anti spam features must stay efficient.`);
        console.log(`If you'd like to bypass this check, see tunneler.js or make an another Application.`);
        console.log('Closing down...');
        process.exit(1);
    } else {
        console.log(`Successfully logged in as ${client.user.username}.`);
        console.log(`Serving ${client.guilds.array().length} server(s).`);
    }

    // Set settings for the owner.
    if (Auth.owner !== undefined && Auth.owner !== '') {
        guildSettings = guildSettings.set(Auth.owner, Settings.getGuildSetting(Auth.owner, true));
        console.log(`Owner ${Auth.owner} registered.`);
    } else {
        console.log(`Parameter "owner" is not set in Auth.json.`);
    }

    // Set settings for each guild.
    client.guilds.forEach((guild) => {
        guildSettings = guildSettings.set(guild.id, Settings.getGuildSetting(guild.id));
        console.log(`Settings registered for ${guild.name} by ${guild.owner.user.username}. Members: ${guild.memberCount}.`);
    });
});

/**
 * A disconnection handler.
 */
client.on('disconnected', () => {
    console.log('Lost connection, exiting...');
    process.exit(1);
});

/**
 * On joining a new guild.
 */
client.on('guildCreate', (guild) => {
    console.log('Joined to a new guild: ', guild.name);
    guildSettings.set(guild.id, Settings.getGuildSetting(guild.id));
});

/**
 * The main message handler.
 */
client.on('message', Message => {
    try {

        // Identify the message source.
        const sourceId = Message.guild !== null
            ? Message.guild.id
            : Message.author !== null ? Message.author.id : undefined;
        const owner = sourceId === Auth.owner;

        // We'll listen messages only if on a guild or from the owner.
        if (
            sourceId !== undefined &&
            (Message.guild !== null || owner)
        ) {

            // Load guild settings.
            const settingsContainer = guildSettings.has(sourceId)
                ? guildSettings.get(sourceId)
                : {};

            // Anti spam measures.
            if (
                settingsContainer !== undefined &&
                settingsContainer['enable_anti_spam_filtering'] &&
                AntiSpam.isSpam(sourceId, Message.author.id, Message, settingsContainer)
            ) {
                // Ban the filthy peasant.
                const target = Message.member;
                if (Ban.execute(target)) {
                    // Ban successful.
                    if (!settingsContainer['enable_quiet_mode']) {
                        Message.channel.send(`${Strings.util.antispam.success_0}` +
                            `${target.user.username}` +
                            `${Strings.util.antispam.success_1}`);
                    }
                }
            }

            // Client commands.
            if (
                settingsContainer !== undefined &&
                settingsContainer['enable_client_commands']
            ) {
                const commandContainer = Command.getContainer(Message, Auth.id);
                if (commandContainer.hasOwnProperty('cmd')) {
                    // Message should always be provided for special actions, but the content should always
                    // be read from the commandContainer. Public strings are not safe!
                    if (commands.hasOwnProperty(commandContainer['cmd'])) {
                        const command = commands[commandContainer['cmd']];
                        try {
                            command.execute(Message, commandContainer['str']);
                        } catch (e) {
                            console.log(`Executing command (${commandContainer['cmd']}) failed. Please check your code.`)
                        }
                    } else {
                        console.log(`Invalid command (${commandContainer['cmd']}) inputted.`);
                    }
                }
            }
        }
    } catch (e) {
        console.log(e.stack);
        console.log(process.version);
        console.log('Error: Failed to process a message.');
    }
});