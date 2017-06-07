const {print, log} = require('../../util/module.inc.debug')();
const stringAnalysis = require('string-analysis-js');

module.exports = (Settings, name) => {
    const module = {};
    const guildContainer = {};
    const maxLogLength = 16;

    const getCertainty = (msgLog) => {
        try {
            
        } catch (e) {

        }
        return [];
    }

    const getSeverity = (msgLog) => {
        try {
            
        } catch (e) {

        }
        return [];
    }

    /**
     * Appends a log array with the new content.
     * @param {array} msgLog
     * @param {string} content
     * @param {number} createdTimestamp
     */
    const getAppendedUserLog = (msgLog, content, createdTimestamp) => {
        try {
            const thisLog = msgLog || [];
            thisLog.push({content, createdTimestamp});
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
            violations: {},
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
    module.execute = (Message, guildSettings) => {
        try {
            const {guild, author, content, createdTimestamp} = Message;
            // Get the existing or new guild container.
            const thisGuild = getGuild(String(guild.id));
            // Update the guild log for the user.
            const thisLog = getAppendedUserLog(
                thisGuild.log[author.id], content, createdTimestamp);
            // Analyse the log.
            // Certainty of the log including spam.
            const certainty = getCertainty(thisLog);
            // Severity of the possible spam.
            const severity = getSeverity(thisLog);
            // Decide a suitable punishment.
            if (certainty > 50) {
                // Spam detected.
                if (severity >= 8) {
                    // Extreme.
                } else if (severity > 6) {
                    // High.
                } else if (severity > 4) {
                    // Moderate.
                } else {
                    // Low.
                }
            }
            // Save the updated guild object.
            thisGuild.log[author.id] = thisLog;
            setGuild(String(guild.id), thisGuild);
        } catch (e) {
            log('Could not execute.', name, e);
            return `Execution of (${name}) failed.`;
        }
        return '';
    };

    return module;
};
