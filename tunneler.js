const Discord = require('discord.js');
const client = new Discord.Client();
const Auth = require("./config/auth.json");
const Commands = require('./commands')(client);
const Util = require('./util')();

client.login(Auth.token);

/**
 * An initial connection handler.
 */
client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}, serving ${client.guilds.array().length} servers.`);
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
    const commandContainer = Util.handleMessage(Message);
    if (commandContainer.hasOwnProperty('cmd')) {
        // Message should always be provided, commandContainer should be used if you are about to
        // read the content of the user generated message.
        // NEVER read the message.content directly from a Message.
        Commands[commandContainer.cmd](Message, commandContainer);
    }
});