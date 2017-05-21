const fs = require('fs');

module.exports = () => {
    const module = {};
    const path = './console.log';
    const tag = 'MISC';
    let init = false;

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
            fs.writeFileSync(path, 'Tunnelerjs log file created\n.');
            return true;
        } catch (e) {
            console.log('>> [DEBUG] Creating a log file failed: ', e);
            return false;
        }
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
            console.log('>> [DEBUG] Checking log file length failed: ', e);
            return false;
        }
    };

    /**
     * Prints a formatted console command.
     * @param {string} str
     * @param {string} src
     * @param {boolean} log
     * @param {object} err
     * @return {boolean}
     */
    module.print = (str, src, log, err) => {
        try {
            // Printable string must exist.
            if (
                !isInitialized() ||
                typeof str !== 'string' ||
                !str.length
            ) return false;
            // Display a console log.
            console.log(`>> [${src || tag}] ${str.substr(0, 128)}`);
            if (log) module.log(str, src, err);
            return true;
        } catch (e) {
            console.log('>> [DEBUG] Printing failed: ', e);
            return false;
        }
    };

    /**
     * Logs a formatted message.
     * @param {str} str
     * @param {src} src
     * @param {object} err
     * @return {boolean}
     */
    module.log = (str, src, err) => {
        try {
            // Printable string or error must exist.
            if (
                !isInitialized() ||
                (typeof str !== 'string' || !str.length) && !err
            ) return false;
            // Make sure the log file does not get too large.
            checkLogFileLength();
            const initLine = init ? '' : '\n[ NEW PROCESS ]\n\n';
            const msgLine = `${new Date()}\n[${src || tag}] `
            + `${str.substr(0, 1024)}`;
            const errLine = err !== undefined ? `\n${err}` : '';
            // Write log.
            fs.appendFileSync(
                path, `${initLine}${msgLine}${errLine}\n\n`, 'utf8');
            init = true;
        } catch (e) {
            console.log('>> [DEBUG] Logging failed: ', e);
            return false;
        }
    };

    return module;
};
