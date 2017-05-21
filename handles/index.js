const {print} = require('../util/module.inc.debug')();

/**
 * Event handler
 *
 * Handles all the incoming events.
 * @param {object} AuthMap
 * @param {object} GuildsMap
 */
module.exports = (AuthMap, GuildsMap) => {
    const Discord = require('discord.js');
    const Client = new Discord.Client();
    Client.login(AuthMap.token);

    /**
     * Client connected and ready to execute.
     */
    const onReady = require('./on.ready')(Client, GuildsMap);
    Client.on('ready', (Message) => {
        try {
            onReady.execute();
        } catch (e) {
            print(
                'Client ready failed. The process will now exit.',
                'MAIN ERROR', true, e
            );
            process.exit(1);
        }
    });

    /**
     * Client received messages.
     *
     * This handle has a middleware support. Middlewares are
     * executed before the commands.
     */
    const onMessage = require('./on.message')(Client, GuildsMap);
    Client.on('message', (Message) => {
        try {
            new Promise((resolve, reject) => {
                // Middlewares will run first.
                // The command will run only if the middleware
                // allows it.
                const haltReason = onMessage.prepare(Message);
                if (haltReason.length) {
                    reject(haltReason);
                }
                resolve(Message);
            }).then((Message) => {
                // Run the command.
                onMessage.execute(Message);
            }).catch((e) => {
                print(
                    `Encountered an error while handling a message.`,
                    `MESSAGE HANDLE`, true, e
                );
            });
        } catch (e) {
            print(
                `Processing a message failed.`,
                `MAIN ERROR`, true, e
            );
        }
    });

    /**
     * Client disconnected.
     */
    const onDisconnected = require('./on.disconnected')(Client);
    Client.on('disconnected', (Message) => {
        try {
            onDisconnected.execute();
        } catch (e) {
            print(
                'Disconnecting failed. The process will now exit.',
                'MAIN ERROR', true, e
            );
            process.exit(1);
        }
    });
};
