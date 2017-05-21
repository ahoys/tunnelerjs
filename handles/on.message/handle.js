const {log} = require('../../util/module.inc.debug')();
const Parser = require('../../util/module.inc.parser')();

/**
 * Message handle.
 * @param {object} Client
 * @param {object} GuildsMap
 * @return {object}
 */
module.exports = (Client, GuildsMap) => {
    const module = {};

    /**
     * Executes middleware for the handle.
     * Is able to block the execution is necessary.
     * @param {object} Message
     * @return {string}
     */
    module.prepare = (Message) => {
        const {guild, channel} = Message;
        const thisGuild = GuildsMap[guild.id];
        if (
            thisGuild &&
            thisGuild.middlewares
        ) {
            Object.keys(thisGuild.middlewares).forEach((mwKey) => {
                const {
                    execute,
                    enabledChannels,
                    excludedChannels,
                } = thisGuild.middlewares[mwKey];
                // Make sure this channel is included to be middlewared
                // and then execute. If the execution returns true,
                // the command process may go on.
                if (
                    Parser.isIncluded(
                        channel.name,
                        enabledChannels,
                        excludedChannels,
                        true
                    )
                ) {
                    const haltReason = execute(Message);
                    if (typeof haltReason !== 'string' || haltReason.length) {
                        // An invalid return or an error message encountered.
                        return typeof haltReason === 'string'
                        ? haltReason
                        : `Middleware ${mwKey} halted the processing.`;
                    }
                };
            });
        }
        // No middlewares specified or the execution was ok.
        return '';
    };

    /**
     * Executes the handle.
     * @param {object} Message
     * @return {boolean}
     */
    module.handle = (Message) => {
        const {content, guild, channel} = Message;
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
        const {
            execute,
            enabledChannels,
            excludedChannels,
        } = thisGuild.commands[cmdKey];
        if (Parser.isIncluded(
            channel.name, enabledChannels, excludedChannels, true)
        ) {
            // Measure execution time for the command.
            const perfMeasure = process.hrtime();
            const response = execute(Message, Client);
            log(
                `A triggered command (${cmdKey}) took `
                + `${process.hrtime(perfMeasure)[0]}s (`
                + `${process.hrtime(perfMeasure)[1]}ms) to execute on `
                + `a channel (${channel.name}).`,
                'MAIN'
            );
            if (typeof response === 'string' && response.length) {
                // The command responded with something to say...
                Message.reply(response);
            }
            return true;
        }
        return false;
    };

    return module;
};
