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
    const onReady = require('./on.ready/handle.js')(Client, GuildsMap);
    Client.on('ready', (Message) => {
        try {
            onReady.handle();
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
    const onMessage = require('./on.message/handle.js')(Client, GuildsMap);
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
                onMessage.handle(Message);
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
    const onDisconnect = require('./on.disconnect/handle.js')();
    Client.on('disconnect', (CloseEvent) => {
        try {
            onDisconnect.handle(CloseEvent);
        } catch (e) {
            print(
                'Disconnect failed. The process will now exit.',
                'MAIN ERROR', true, e
            );
            process.exit(1);
        }
    });

    /**
     * Client reconnecting.
     */
    const onReconnecting = require('./on.Reconnecting/handle.js')();
    Client.on('reconnecting', () => {
        try {
            onReconnecting.handle();
        } catch (e) {
            print(
                'Reconnecting failed. The process will now exit.',
                'MAIN ERROR', true, e
            );
            process.exit(1);
        }
    });
};
