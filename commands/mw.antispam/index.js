const {print, log} = require('../../util/module.inc.debug')();
const stringAnalysis = require('string-analysis-js');

module.exports = (Settings, name) => {
    const module = {};
    const guildContainer = {};
    const maxLogLength = 16;

    /**
     * Calculates certainty based on author's content analysis history.
     * @param {array} msgLog
     * @return {array}
     */
    const getCertainty = (msgLog) => {
        try {
            const thisLog = msgLog || [];
            const len = Object.keys(thisLog).length;
            const sums = thisLog[len - 1].analysisSum || [];
            const avgs = [];
            // Calculate average of the collected certainties.
            // This way the more you send proper messages, the less
            // likely it is that you will get flagged.
            sums.forEach((sum, i) => {
                avgs[i] = sum / len;
            });
            // We'll return the highest value.
            return Math.max.apply(null, thisLog[len - 1].analysis || []) >= 0.5
                ? Math.max.apply(null, avgs) : 0;
        } catch (e) {
            print(`Could not return certainty.`, name, true, e);
        }
        return [];
    }

    /**
     * Returns value of c.
     * @param {number} a
     * @param {number} b
     * @param {number} c
     * @return {number}
     */
    const getDirectlyProportionalAnalysis = (a, b, c) => {
        try {
            return (b * c) / (a || 1);
        } catch (e) {
            print(`Could not return a directly proportional analysis.`, name,
                true, e);
        }
        return 0;
    }

    /**
     * Returns a severity count in a range of 0 to 10.
     * @param {array} msgLog
     * @return {number}
     */
    const getSeverity = (msgLog) => {
        try {
            const thisLog = msgLog || [];
            const analysis = thisLog[thisLog.length - 1].analysis || [];
            const thisSum = analysis.reduce((prev, curr) => prev + curr);
            const dirValueOfAnalysis = getDirectlyProportionalAnalysis(
                analysis.length, 10, thisSum);
            const len = thisLog[thisLog.length - 1].content.length > 100
                ? 100 : thisLog[thisLog.length - 1].content.length;
            const dirValueOfLength = getDirectlyProportionalAnalysis(
                100, 10, len);
            return (dirValueOfAnalysis + dirValueOfLength) / 2;
        } catch (e) {
            print(`Could not return severity.`, name, true, e);
        }
        return 0;
    }

    /**
     * Returns an early analysis of the new content.
     * @param {array} msgLog
     * @param {string} content
     * @return {array}
     */
    const getContentAnalysis = (msgLog, content) => {
        try {
            const thisLog = msgLog || [];
            const lenIndex = thisLog.length - 1;
            const thisContent = content !== undefined ? content : '';
            const resultObj = [[], []];
            stringAnalysis.getAll().forEach((tool, i) => {
                if (tool.parameters.content.indexOf('string') !== -1) {
                    const analysisRes = tool.func(content);
                    resultObj[0][i] = analysisRes;
                    resultObj[1][i] = lenIndex >= 0
                        ? thisLog[lenIndex].analysisSum[i] + analysisRes
                        : analysisRes;
                }
            });
            return resultObj;
        } catch (e) {
            print(`Could not return a content analysis.`, name, true, e);
        }
        return [[0, 0, 0, 0], [0, 0, 0, 0]];
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
            const analysisObj = getContentAnalysis(thisLog, content);
            thisLog.push({
                content,
                createdTimestamp,
                analysis: analysisObj[0],
                analysisSum: analysisObj[1],
            });
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
            // Decide a suitable punishment.
            if (certainty > 0.5) {
                // Severity of the possible spam.
                const thisViolations = thisGuild.violations[author.id] || 0;
                const severity = getSeverity(thisLog, thisViolations);
                // Add a violation.
                thisGuild.violations[author.id] = thisViolations !== undefined
                    ? thisViolations + 1 : 1;
                // Spam detected.
                if (severity >= 8) {
                    // Extreme.
                    console.log('extreme');
                } else if (severity > 6) {
                    // High.
                    console.log('high');
                } else if (severity > 4) {
                    // Moderate.
                    console.log('moderate');
                } else {
                    // Low.
                    console.log('low');
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
