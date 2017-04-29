const fs = require('fs');
/**
 * Implements debugging functionality.
 */
module.exports = (filepath = './console.log') => {
    const module = {};

    // Filepath must be valid.
    if (typeof filepath !== 'string') {
        console.log('[DEBUG] Invalid filepath. The process will now exit.');
        process.exit(1);
        return false;
    }

    // Initial values.
    const defaultSrc = 'MISC';
    let init = true;

    /**
     * Console print & log.
     */
    module.print = (str = '', src = defaultSrc, log = true, err) => {
        try {
            if (
                typeof str !== 'string' ||
                typeof src !== 'string' ||
                typeof log !== 'boolean'
            ) {
                console.log('[DEBUG] Invalid print parameters.');
                return false;
            }
            const msgLine = `${log ? '>> ' : '> '}${str}`;
            console.log(msgLine);
            if (log) {
                module.log(str, src, filepath, err);
            }
            return true;
        } catch (e) {
            console.log('[DEBUG] Printing has failed.');
            return false;
        }
    };

    /**
     * Logged development debug.
     */
    module.log = (str = '', src = defaultSrc, path = filepath, err) => {
        try {
            if (
                typeof str !== 'string' ||
                typeof src !== 'string' ||
                typeof path !== 'string'
            ) {
                // Invalid parameters given.
                console.log('[DEBUG] Invalid print parameters.');
                return false;
            }
            if (str.length < 1) {
                // No need to log empty.
                return false;
            }
            const timestamp = new Date();
            const msg = `[${src}] ${str}`;
            const errLine = err ? `\n${err}` : '';
            if (fs.existsSync(path)) {
                // An existing file.
                const stats = fs.statSync(path);
                const fileSizeInBytes = stats.size;
                if (fileSizeInBytes > 1000000) {
                    fs.truncateSync(path, 0);
                }
                const initLine = init ? '\n= NEW PROCESS ===========\n' : '';
                fs.appendFileSync(path, `${initLine}${timestamp}\n${msg}${errLine}\n\n`);
            } else {
                // Create a new file.
                const initLine = init ? '= NEW PROCESS ===========\n' : '';
                fs.writeFileSync(path, `${initLine}${timestamp}\n${msg}${errLine}\n\n`, 'utf8');
            }
            if (init) {
                // 1st run.
                init = false;
            }
            return true;
        } catch (e) {
            console.log(`[DEBUG] Writing to log has failed.
            Make sure the application has all the required permissions.`);
            return false;
        }
    };

    return module;
};
