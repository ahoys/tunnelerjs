const Discord = require('discord.js');
const client = new Discord.Client();
const Auth = require("./config/auth.json");
const Commands = require('./commands')(client);
const Util = require('./util')();
const Strings = require('./config/strings.json');
const AntiSpam = require('./util/module.inc.antispam')();
const Immutable = require('immutable');

let guildSettings = new Immutable.Map({});

client.login(Auth.token);

/**
 * An initial connection handler.
 */
client.on('ready', () => {

    // Make sure the capacity is not exceeded.
    if (client.guilds.array().length > 16) {
        console.log('Too many concurrent servers: ', client.guilds.array().length > 16);
        process.exit(1);
    } else {
        console.log(`Logged in as ${client.user.username}, serving ${client.guilds.array().length} server(s).`);
    }

    // Set settings for each guild.
    client.guilds.forEach((guild) => {
        guildSettings = guildSettings.set(guild.id, Util.getGuildSettings(guild.id));
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
    guildSettings.set(guild.id, Util.getGuildSettings(guild.id));
});

/**
 * The main message handler.
 */
client.on('message', Message => {
    try {
        // Load guild settings.
        const guild = Message.guild;
        const settingsContainer = guildSettings.has(guild.id)
            ? guildSettings.get(guild.id)
            : {};

        // Anti spam measures.
        if (
            settingsContainer !== undefined &&
            settingsContainer['enable_anti_spam_filtering'] &&
            AntiSpam.isSpam(guild.id, Message.author.id, Message.content, settingsContainer)
        ) {
            console.log('INFO: Spam detected from', Message.author.username);
        }

        // Client commands.
        if (
            settingsContainer !== undefined &&
            settingsContainer['enable_client_commands']
        ) {

        }

    } catch (e) {
        console.log(e.stack);
        console.log(process.version);
        console.log('Error: Failed to process a message.');
    }
    //
    //
    //
    //
    // // Handle spamming.
    // if (
    //     Boolean(settingsContainer.enable_anti_spam_filtering) &&
    //     Util.isSpam(Message, settingsContainer)
    // ) {
    //     const user = Message.member;
    //     if (!settingsContainer['enable_quiet_mode']) {
    //         Message.channel.send(`${Strings.action_ban.spam.success_0} ` +
    //             `${user.user.username}` +
    //             ` ${Strings.action_ban.spam.success_1}`);
    //     }
    //
    //     if (user.bannable) {
    //         const ban = user.ban(1);
    //         ban.then((val) => {
    //             console.log(`Successfully banned: ${user.username}`);
    //         }).catch((reason) => {
    //             console.log('Ban failed: ', reason);
    //         });
    //     }
    // }
    //
    // const commandContainer = Util.handleMessage(Message);
    // if (commandContainer.hasOwnProperty('cmd')) {
    //     // Message should always be provided, commandContainer should be used if you are about to
    //     // read the content of the user generated message.
    //     // NEVER read the message.content directly from a Message.
    //     Commands[commandContainer.cmd](Message, commandContainer);
    // }
});