const {print, log} = require('../../util/module.inc.debug')();
const stringAnalysis = require('string-analysis-js');
const punish = require('./parts/module.inc.punish')();
const analyse = require('./parts/module.inc.analyse')();

module.exports = (Settings, Strings, name) => {
    const module = {};

    // "authors" includes analysis, warnings and violations of authors.
    // See the template below for knowledge about the inner structure.
    const authors = [];
    const authorTemplate = {
        "joinedTimestamp": 0,
        "analysisObj": {
            "log": [],
            "last": [],
            "sums": [],
            "avg": [],
        },
        "warningCount": 0,
    }
    // How many content lines are being analyzed at once.
    // Decreasing this value will make the module to act more
    // aggressively.
    const maxBuffer = 8;

    /**
     * Appends the given log with a new content.
     * @param {*} authorLog
     * @param {string} content
     * @param {number} createdTimestamp
     */
    const getAppendedLog = (authorLog, content, createdTimestamp) => {
        try {
            const thisLog = authorLog;
            thisLog.push({
                content,
                createdTimestamp,
            });
            if (thisLog.length > maxBuffer) {
                thisLog.shift();
            }
            return thisLog;
        } catch (e) {
            print(`Could not append a log.`, name, true, e);
        }
        return {};
    }

    /**
     * Saves an author.
     * @param {string} id
     * @param {*} data
     */
    const setAuthor = (id, data) => {
        try {
            authors[id] = data;
        } catch (e) {
            print(`Could not set a new author.`, name, true, e);
        }
    }

    /**
     * Returns an author. New or existing.
     * @param {string} id
     * @return {*}
     */
    const getAuthor = (id) => {
        try {
            return authors[id] || authorTemplate;
        } catch (e) {
            print(`Could not return an existing author.`, name, true, e);
        }
        return {};
    }

    module.execute = (Message, guildSettings) => {
        try {
            const { author, content, createdTimestamp, member } = Message;
            // Load the author.
            const thisAuthor = getAuthor(author.id);
            if (thisAuthor.joinedTimestamp === 0) {
                // A new author.
                thisAuthor.joinedTimestamp = member.joinedTimestamp;
            }
            const ao = thisAuthor.analysisObj;
            // Append the author's message log.
            ao.log = getAppendedLog(ao.log, content, createdTimestamp);
            // Analyse the most recent content.
            ao.last = analyse.getAnalysis(ao.log);
            // Summarize all the content.
            ao.sums = analyse.getAppendedSums(
                ao.sums,
                ao.last,
                maxBuffer
            );
            // Get average of the content analysement history.
            ao.avg = analyse.getAnalysisAvg(
                ao.sums[ao.sums.length - 1],
                ao.sums.length
            );
            // Decide whether the author is a spammer.
            if (analyse.isSpamming(ao.avg, content.length)) {
                const severity = analyse.getSeverity(ao);
                if (severity >= 8) {
                    // Extreme.
                } else if (severity >= 6) {
                    // High.
                } else if (severity >= 4) {
                    // Moderate.
                } else {
                    // Low.
                }
            }
            // Save analysis.
            thisAuthor.analysisObj = ao;
            // Save the author with changes.
            setAuthor(author.id, thisAuthor);
        } catch (e) {
            print(`Could not execute a middleware (${name}).`, name, true, e);
        }
        return '';
    }

    return module;
}
