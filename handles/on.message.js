module.exports = (Client, Debug, Parser, GuildsMap) => {
    const module = {};

    /**
     * Middleware for the handle.
     * If returns a string, the handle will not execute.
     * @param {object} Message
     * @return {string}
     */
    module.prepare = (Message) => {
        const {guild} = Message;
        const thisGuild = GuildsMap[guild.id];
        if (
            thisGuild &&
            thisGuild.middleware &&
            thisGuild.middleware.constructor === Array
        ) {
            thisGuild.middleware.forEach((mwKey) => {
                const haltReason = thisGuild.middleware[mwKey].execute(Message);
                if (typeof haltReason === 'string' && haltReason.length) {
                    // The middleware orders that the command will not
                    // be executed. Return the reason.
                    return haltReason;
                }
            });
        }
        return '';
    };

    /**
     * Executes the handle.
     * @param {object} Message
     * @return {boolean}
     */
    module.execute = (Message) => {
        const {content, guild} = Message;
        const {user} = Client;
        // Listen for direct commands only.
        const thisGuild = GuildsMap[guild.id];
        if (
            !thisGuild ||
            !Message.isMentioned(user) ||
            !Parser.isSafe(content)
        ) return false;
        const cmdKey = Parser.firstMatch(
            Object.keys(thisGuild.commands),
            Parser.trim(content)
        );
        // The command must exist.
        if (thisGuild.commands[cmdKey] === undefined) return false;
        // Measure execution time for the command.
        const perfMeasure = process.hrtime();
        const response = thisGuild.commands[cmdKey].execute(Message, Client);
        Debug.log(
            `A command (${cmdKey}) took `
            + `${process.hrtime(perfMeasure)[0]}s and `
            + `${process.hrtime(perfMeasure)[1]}ms to execute.`,
            'MAIN'
        );
        if (typeof response === 'string' && response.length) {
            // The command responded with something to say...
            Message.reply(response);
        }
        return true;
    };

    return module;
};
