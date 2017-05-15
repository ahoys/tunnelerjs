module.exports = (Debug, AuthMap, Parser, GuildsMap) => {
    const Discord = require('discord.js');
    const Client = new Discord.Client();

    const onReady = require('./on.ready')(Client, Debug, GuildsMap);
    const onMessage = require('./on.message')(Client, Debug, Parser, GuildsMap);
    const onDisconnected = require('./on.disconnected')(Client);

    // When the client has connected and is ready to execute.
    Client.on('ready', (Message) => {
        try {
            onReady.execute();
        } catch (e) {
            Debug.print(
                'Client ready failed. The process will now exit.',
                'MAIN ERROR', true, e
            );
            process.exit(1);
        }
    });

    // A new message event.
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
                Debug.print(
                    `Encountered an error while handling a message.`,
                    `MESSAGE HANDLE`, true, e
                );
            });
        } catch (e) {
            Debug.print(
                `Processing a message failed.`,
                `MAIN ERROR`, true, e
            );
        }
    });

    // Client disconnected event.
    Client.on('disconnected', (Message) => {
        try {
            onDisconnected.execute();
        } catch (e) {
            Debug.print(
                'Disconnecting failed. The process will now exit.',
                'MAIN ERROR', true, e
            );
            process.exit(1);
        }
    });

    // Start the client.
    Client.login(AuthMap.token);
};
