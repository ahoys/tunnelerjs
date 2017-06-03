const {print, log} = require('../../util/module.inc.debug')();
const stringAnalysis = require('string-analysis-js');

module.exports = (Settings, name) => {
    const module = {};
    const guildContainer = {};
    const maxLogLength = 16;

    /**
     * Appends a log array with the new content.
     * @param {array} msgLog
     * @param {string} content
     */
    const getAppendedUserLog = (msgLog, content) => {
        try {
            const thisLog = msgLog || [];
            thisLog.push(content);
            if (thisLog.length > maxLogLength) {
                thisLog.shift();
            }
            return thisLog;
        } catch (e) {
            print(`Could not append a guild log (${thisGuild.id}).`, name, true, e);
        }
        return [];
    }

    /**
     * Returns the guild corresponding the given id.
     * @param {string} id
     * @return {*}
     */
    const getGuild = (id) => {
        try {
            if (guildContainer[id] !== undefined) {
                // Guild found.
                return guildContainer[id];
            }
        } catch (e) {
            print(`Could not fetch a guild (${id}).`, name, true, e);
        }
        return {
            id,
            log: {},
        }
    }

    /**
     * Sets a guild to guildContainer.
     * @param {string} id 
     * @param {*} guild 
     */
    const setGuild = (id, guild) => {
        try {
            if (id !== undefined) {
                guildContainer[id] = guild || {id, log: {}};
            }
        } catch (e) {
            print(`Could not set a guild (${id}).`, name, true, e);
        }
    }

    /**
     * Executes the module.
     * @param {*} Message
     * @return {string}
     */
    module.execute = (Message) => {
        try {
            const {guild, author, content} = Message;
            // Get the existing or new guild container.
            const thisGuild = getGuild(String(guild.id));
            // Update the guild log for the user.
            thisGuild.log[author.id] = getAppendedUserLog(
                thisGuild.log[author.id], content);
            // Save the updated guild object.
            setGuild(String(guild.id), thisGuild);
            return '';
        } catch (e) {
            log('Could not execute.', name, e);
            return `Execution of (${name}) failed.`;
        }
    };

    return module;
};
