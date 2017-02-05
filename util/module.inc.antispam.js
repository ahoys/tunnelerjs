const Immutable = require('immutable');
const Strings = require('../config/strings.json');
module.exports = () => {

    const module = {};
    let messageLog = new Immutable.OrderedMap({});
    let warningLog = new Immutable.Map({});

    /**
     * Empties message log buffer now and then, avoiding buffer overflows.
     * @param gId
     * @param uId
     * @param logLength
     */
    module.refreshMessageLog = (gId, uId, logLength) => {
        if (messageLog.has(gId)) {
            let guildLog = messageLog.get(gId);
            if (guildLog.has(uId)) {
                let userLog = guildLog.get(uId);
                if (userLog.length >= logLength) {
                    userLog.shift();
                    guildLog = guildLog.set(uId, userLog);
                    messageLog = messageLog.set(gId, guildLog);
                }
            }
        }
    };

    /**
     * Returns occurrences in an array.
     * @param array
     * @param search
     * @returns {R|number|*|any}
     */
    module.getOccurrences = (array, search) => {
        return array.reduce((n, value) => {
            return n + (value === search);
        }, 0);
    };

    /**
     * Returns whether the given string is a link.
     * @param str
     * @returns {boolean}
     */
    module.isLink = (str) => {
        return new RegExp("([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?").test(String(str));
    };

    /**
     * Returns a count of identical links in a single message.
     * @param message
     * @returns {R|number|*|any|any|number|*|R}
     */
    module.getMessageIdenticalLinksCount = (message) => {
        const links = [];
        let count = 0;
        const words = message.split(" ");
        words.forEach((word) => {
            if (module.isLink(word)) {
                links.push(word);
                const occurrences = module.getOccurrences(links, word);
                count = occurrences > count ? occurrences : count;
            }
        });
        return count;
    };

    /**
     * Returns a count of identical links of the latest messages.
     * @param userLog
     */
    module.getTotalIdenticalLinksCount = (userLog) => {
        const links = [];
        let total_count = 0;
        userLog.forEach((message) => {
            const words = message.split(" ");
            words.forEach((word) => {
                if (module.isLink(word)) {
                    links.push(word);
                    const occurrences = module.getOccurrences(links, word);
                    total_count = occurrences > total_count ? occurrences : total_count;
                }
            });
        });
        return total_count;
    };

    /**
     * Returns a count of identical messages of the latest messages.
     * @param userLog
     * @returns {R|number|*|any|any|number|*|R}
     */
    module.getTotalIdenticalMessagesCount = (userLog) => {
        let count = 0;
        userLog.forEach((message) => {
            const occurrences = module.getOccurrences(userLog, message);
            count = occurrences > count ? occurrences : count;
        });
        return count;
    };

    /**
     * Clears user's history.
     * @param gId
     * @param uId
     */
    module.clearUserHistory = (gId, uId) => {
        if (messageLog.has(gId)) {
            let guildLog = messageLog.get(gId);
            if (guildLog.has(uId)) {
                guildLog = guildLog.set(uId, []);
                messageLog = messageLog.set(gId, guildLog);
                return true;
            }
        }
        return false;
    };

    /**
     * Returns whether the message can be considered as spam.
     * @param uId
     * @param gId
     * @param messageObject
     * @param settingsContainer
     */
    module.isSpam = (uId, gId, messageObject, settingsContainer) => {

        // By default nothing is spam.
        let spam = false;
        const message = messageObject.content;

        // Verify message log.
        if (!messageLog.has(gId)) {
            messageLog = messageLog.set(gId, new Immutable.Map({}));
        }

        // Get the corresponding guild log.
        if (gId !== undefined && uId !== undefined && messageLog.has(gId)) {
            let guildLog = messageLog.get(gId);
            // Look for the user.
            const userLog = guildLog.has(uId) ? guildLog.get(uId) : [] ;
            // Save the message.
            userLog.push(message);
            guildLog = guildLog.set(uId, userLog);
            messageLog = messageLog.set(gId, guildLog);
            // Consider whether the user has spammed or not.
            spam = module.getMessageIdenticalLinksCount(message) > settingsContainer['anti_spam_max_identical_urls_in_message'] ||
                module.getTotalIdenticalLinksCount(userLog) > settingsContainer['anti_spam_max_identical_urls_in_total'] ||
                module.getTotalIdenticalMessagesCount(userLog) > settingsContainer['anti_spam_max_identical_messages_total'];
        }

        // Handle warnings.
        if (spam && settingsContainer['anti_spam_warning_count_before_ban'] > 0) {
            const userWarnings = warningLog.has(uId) ? Number(warningLog.get(uId)) + 1 : 1 ;
            warningLog = warningLog.set(uId, userWarnings);
            if (warningLog.get(uId) <= settingsContainer['anti_spam_warning_count_before_ban']) {
                // Let the poor fell pass this time, but warn him.
                if (module.clearUserHistory(gId, uId)) {
                    spam = false;
                    messageObject.reply(Strings.util.antispam.warning_0);
                    console.log(`Warned an user (${messageObject.member.user.username}) about spamming.`)
                }
            }
        }

        // Make sure the logs don't grow too big.
        module.refreshMessageLog(gId, uId, settingsContainer['anti_spam_log_length'] ? settingsContainer['anti_spam_log_length'] : 8);

        // Return the result of spamming.
        return spam;
    };

    return module;
};