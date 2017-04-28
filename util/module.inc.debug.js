const fs = require('fs');
/**
 * Implements debugging functionality.
 */
module.exports = (debugEnabled) => {
    const module = {};
    const filepath = './console.log';
    let init = true; // Init is used to make a few new linebreaks before staring a new logging session.
    if (debugEnabled) {
        console.log('[DEBUG] Development debugging enabled.');
    }
    /**
     * Non-debug console print.
     */
    module.print = (str = '', source = 'MISC') => {
        if (
            typeof str === 'string' &&
            typeof source === 'string' &&
            str.length > 0 &&
            source.length > 0
        ) {
            const timestamp = new Date();
            const msgLine = `[${source}] ${str}`;
            if (!fs.existsSync(filepath)) {
                // A new file.
                fs.writeFile(filepath, `${timestamp} ${msgLine}\n`, (err) => {
                    if (err) {
                        console.log(`[DEBUG] Creating the log has failed.
                        Make sure the application has all the required permissions.`);
                    }
                })
            } else {
                // An existing file.
                const stats = fs.statSync(filepath);
                const fileSizeInBytes = stats.size;
                console.log(fileSizeInBytes);
                if (fileSizeInBytes > 50000000) {
                    // The log file is larger than 50 MB, time to reset.
                    fs.truncate(filepath, 0, (err) => {
                        if (err) {
                            console.log(`[DEBUG] Clearing the log file failed.
                            Make sure the application has all the required permissions.`);
                        }
                    })
                }
                fs.appendFile(filepath, `${init ? '\n\n' : ''}${timestamp} ${msgLine}\n`, (err) => {
                    if (err) {
                        console.log(`[DEBUG] Writing to log has failed.
                        Make sure the application has all the required permissions.`);
                    }
                });
                if (init) {
                    init = false;
                }
            }
            console.log(msgLine);
        } else {
            console.log('[DEBUG] Invalid print.');
        }
    };
    /**
     * Logged development debug.
     */
    module.log = (str = '') => {
        if (debugEnabled) {
            if (typeof str === 'string' && str.length > 0) {
                console.log(`[DEBUG] ${str}`);
            } else {
                console.log('[DEBUG] Invalid debug.');
            }
        }
    };
    return module;
};
