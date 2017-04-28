/**
 * Implements debugging functionality.
 */
module.exports = (debugEnabled) => {
    const module = {};
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
            console.log(`[${source}] ${str}`);
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
