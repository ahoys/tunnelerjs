const fs = require('fs');

/**
 * Console printing and log file logging tools.
 * Should be used as the main "API" to display messages
 * to the user.
 * @return {object}
 */
module.exports = () => {
    const module = {};
    const path = './console.log';

    /**
     * Makes sure the log file exists.
     * If not, creates a new log file.
     * @return {boolean}
     */
    const isInitialized = () => {
        try {
            if (fs.existsSync(path)) {
                // The file already exists.
                return true;
            }
            // Create a new log file.
            fs.writeFileSync(path, '');
            return true;
        } catch (e) {
            console.log('[Debug error] Initializing a log file failed.', e);
        }
        return false;
    };

    /**
     * Makes sure the log file does not grow too large.
     * If does, clears the file.
     * @return {boolean}
     */
    const checkLogFileLength = () => {
        try {
            if (fs.statSync(path).size > 1000000) {
                // Uh oh, the file has gotten too large.
                // Truncate.
                fs.truncateSync(path, 0);
            }
            return true;
        } catch (e) {
            console.log('[Debug error] Verifying log length failed.', e);
        }
        return false;
    };

    /**
     * Returns a time string.
     * Format: [HH:MM:ss].
     */
    module.getTimeString = () => {
        try {
            const d = new Date();
            const hh = `0${d.getHours()}`.slice(-2);
            const mm = `0${d.getMinutes()}`.slice(-2);
            const ss = `0${d.getSeconds()}`.slice(-2);
            return `[${hh}:${mm}:${ss}]`;
        } catch (e) {
            console.log('[Debug error] Returning time failed.', e);
        }
        return '';
    }

    /**
     * Returns a formatted tag.
     * Format: [Main] or [Misc ERROR].
     */
    module.getTagString = (tag = 'Misc', hasError = false) => {
        try {
            const tagStr = `${tag.charAt(0).toUpperCase()}`
                +`${tag.slice(1).substr(0, 16).toLowerCase()}`
            return hasError ? `[${tagStr} error]` : `[${tagStr}]`;
        } catch (e) {
            console.log('[Debug error] Returning tag failed.', e);
        }
        return '';
    }

    /**
     * Prints a formatted console command.
     * @param {string} msg
     * @param {string} tag
     * @param {boolean} log
     * @param {object} err
     * @return {boolean}
     */
    module.print = (msg, tag, log = true, err) => {
        try {
            // Initialize files and make sure
            // a printable string exists.
            if (
                typeof msg !== 'string' ||
                !msg.length
            ) return false;
            // Print the main message.
            const timeStr = module.getTimeString();
            console.log(`${timeStr}`
                + `${module.getTagString(tag, err)} ${msg.substr(0, 128)}`);
            if (err) {
                // Print the error if exists.
                // Sometimes the error stacks are very long and that's why
                // we'll only print a short snippet of them. The rest can be
                // found from the log file.
                const isLong = err.length > 32;
                const errMsg = isLong ? `${err.substr(err)}...` : err;
                console.log(`${timeStr} -> ${errMsg}`);
                if (isLong) {
                    // A very long error message encountered.
                    console.log(`${timeStr} -> Read more from the `
                        + `console.log file.`);
                }
            }
            // Also log the message.
            // True by default.
            if (log) module.log(msg, tag, err);
            return true;
        } catch (e) {
            console.log('[Debug error] Printing failed.', e);
        }
        return false;
    };

    /**
     * Logs a formatted message.
     * @param {string} str
     * @param {string} tag
     * @param {object} err
     * @return {boolean}
     */
    module.log = (str, tag, err) => {
        try {
            // A usable log file must exist.
            if (!isInitialized()) return false;
            // Make sure the log file does not get too large.
            // If it does, it will be cleared.
            checkLogFileLength();
            const dateStr = new Date();
            // The user set message part.
            const msgLine = `${new Date()}\n${module.getTagString(tag, err)} `
            + `${str.substr(0, 1024)}`;
            // An error message part.
            const errLine = err !== undefined ? `\nError message: ${err}` : '';
            // And finally, write the log.
            fs.appendFileSync(
                path, `${msgLine}${errLine}\n\n`, 'utf8');
            return true;
        } catch (e) {
            console.log('[Debug error] Logging failed.', e);
        }
        return false;
    };

    return module;
};
