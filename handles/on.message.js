module.exports = (Client, Debug, Parser, GuildsMap) => {
    const modules = {};

    modules.execute = (Message) => {
        const {content, guild} = Message;
        const {user} = Client;
        // Auto-launching commands.
        const thisGuild = GuildsMap[guild.id];
        thisGuild.middleware.forEach((mwKey) => {
            new Promise((resolve, reject) => {
                const response = thisGuild.middleware[mwKey].execute(Message);
                if (response) {
                    resolve();
                }
                reject(`The executing command returned false.`);
            }).catch((e) => {
                Debug.print(`A middleware was rejected. See the log.`,
                `MAIN ERROR`, true, e);
            });
        });
        // Listen for direct commands only.
        if (!Message.isMentioned(user) || !Parser.isSafe(content)) return;
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
    };

    return modules;
};
