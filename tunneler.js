const Discord = require('discord.js');
const client = new Discord.Client();
const Auth = require("./config/auth.json");
const Commands = require('./commands')(client);
const Util = require('./util')();
const Strings = require('./config/strings.json');

client.login(Auth.token);

/**
 * An initial connection handler.
 */
client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}, serving ${client.guilds.array().length} server(s).`);
});

/**
 * A disconnection handler.
 */
client.on('disconnected', () => {
    console.log('Lost connection, exiting...');
    process.exit(1);
});

/**
 * The main message handler.
 */
client.on('message', Message => {
    // Load guild settings.
    const settingsContainer = Util.getGuildSettings(Message);

    // Handle spamming.
    if (
        Boolean(settingsContainer.enable_anti_spam_filtering) &&
        Util.isSpam(Message, settingsContainer)
    ) {
        const user = Message.member;
        if (!settingsContainer['enable_quiet_mode']) {
            Message.channel.send(`${Strings.action_ban.spam.success_0} ` +
                `${user.user.username}` +
                ` ${Strings.action_ban.spam.success_1}`);
        }

        if (user.bannable) {
            const ban = user.ban(1);
            ban.then((val) => {
                console.log(`Successfully banned: ${user.username}`);
            }).catch((reason) => {
                console.log('Ban failed: ', reason);
            });
        }
    }

    const commandContainer = Util.handleMessage(Message);
    if (commandContainer.hasOwnProperty('cmd')) {
        // Message should always be provided, commandContainer should be used if you are about to
        // read the content of the user generated message.
        // NEVER read the message.content directly from a Message.
        Commands[commandContainer.cmd](Message, commandContainer);
    }
});