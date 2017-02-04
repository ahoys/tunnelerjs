const Immutable = require('immutable');
module.exports = () => {

    const module = {};
    let messageLog = new Immutable.OrderedMap({});

    /**
     * Empties message log buffer now and then, avoiding buffer overflows.
     * @param gId
     * @param uId
     */
    module.refreshMessageLog = (gId, uId) => {
        if (messageLog.has(gId)) {
            let guildLog = messageLog.get(gId);
            if (guildLog.has(uId)) {
                let userLog = guildLog.get(uId);
                if (userLog.length >= 8) {
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
        console.log(userLog, count);
        return count;
    };

    /**
     * Returns whether the message can be considered as spam.
     * @param uId
     * @param gId
     * @param message
     * @param settingsContainer
     */
    module.isSpam = (uId, gId, message, settingsContainer) => {

        // By default nothing is spam.
        let spam = false;

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

        // Make sure the logs don't grow too big.
        module.refreshMessageLog(gId, uId);

        // Return the result of spamming.
        return spam;
    };

    return module;
};